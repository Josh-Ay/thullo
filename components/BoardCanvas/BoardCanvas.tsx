import React, { useState } from 'react'
import styles from './styles.module.css'
import { closestCorners, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import NewCanvasItem from '@components/NewCanvasItem/NewCanvasItem';
import { ListService } from '@services/listService';
import { useAppContext } from '@contexts/AppContext';
import BoardList from '@components/BoardList/BoardList';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { CanvasCardItemDragType, CanvasListItemDragType, initialDragItemActive, ItemDragTypes } from './utils';
import ListCard from '@components/ListCard/ListCard';
import { CardService } from '@services/cardService';
import { useSession } from 'next-auth/react';
import { createPortal } from 'react-dom';
import useScrollToElementInCanvas from './hooks/useScrollToElementInCanvas';


const BoardCanvas = () => {
    const { data: session } = useSession();

    const [showNewListModal, setShowNewListModal] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [newListLoading, setNewListLoading] = useState(false);
    const [activeListBeingDragged, setActiveListBeingDragged] = useState<CanvasListItemDragType>(initialDragItemActive);
    const [activeCardBeingDragged, setActiveCardBeingDragged] = useState<CanvasCardItemDragType>(initialDragItemActive);

    const {
        allBoards,
        setAllBoards,
        currentBoardDetails,
        setCurrentBoardDetails,
    } = useAppContext();

    const listService = new ListService();
    const cardService = new CardService();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3, // to allow for click events on the items
            }
        }),
        useSensor(TouchSensor),
    )

    useScrollToElementInCanvas();

    const handleAddNewList = async () => {
        if (newListLoading || newListName.length < 1 || !currentBoardDetails) return;

        setNewListLoading(true);

        try {
            const newListData = await listService.createNewList({
                title: newListName,
                boardId: currentBoardDetails.id,
            })

            setNewListLoading(false);

            const copyOfAllBoards: BoardType[] = allBoards.slice();
            const foundBoard = copyOfAllBoards.find(item => item.id === currentBoardDetails.id);
            if (foundBoard) {
                const copyOfBoardExistingLists = foundBoard.lists?.slice();
                copyOfBoardExistingLists?.push(newListData);

                foundBoard.lists = copyOfBoardExistingLists;
                setAllBoards(copyOfAllBoards);
            }

            setShowNewListModal(false);
            setNewListName('');
        } catch (error) {
            // console.log(error);
            setNewListLoading(false);
        }
    }

    const saveUpdatesToCardOrderInList = async (cardData: {}[], handleResetUpdatesOnError: () => void) => {
        if (cardData.length < 1) return handleResetUpdatesOnError();

        try {
            await cardService.updateCardsOrderInList({
                boardId: currentBoardDetails?.id,
                cards: cardData,
            });

        } catch (error) {
            handleResetUpdatesOnError();
        }
    }

    const saveUpdatesToListOrderInBoard = async (listData: {}, handleResetUpdatesOnError: () => void) => {
        if (!currentBoardDetails?.id) return;

        try {
            await listService.updateListOrderInBoard(currentBoardDetails?.id, listData);
        } catch (error) {
            handleResetUpdatesOnError();
        }
    }

    const resetActiveDragItems = () => {
        setActiveListBeingDragged(initialDragItemActive);
        setActiveCardBeingDragged(initialDragItemActive);
    }

    const handleDragStart = (event: DragStartEvent) => {
        const { active: { data } } = event;
        const { current } = data;

        if (!current) return;

        if (current?.type === ItemDragTypes.List) {
            setActiveListBeingDragged({
                item: current?.item,
                type: current?.type,
            });
            return;
        }

        setActiveCardBeingDragged({
            item: current?.item,
            type: current?.type,
        });
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        if (active.id === over.id) return;

        const { data: { current: itemDragged } } = active;
        const { data: { current: itemToReplace } } = over;

        if (!itemDragged || !itemToReplace) return;
        if (itemDragged?.item?.id === itemToReplace?.item?.id) return;

        if (activeCardBeingDragged.item !== null) {
            const { item: cardBeingDragged } = itemDragged;
            const { item: itemWithDragOver, type } = itemToReplace;

            const copyOfCurrentBoard: BoardType = JSON.parse(JSON.stringify(currentBoardDetails));
            const copyOfBoardLists = copyOfCurrentBoard.lists?.slice();

            // card is dragged over a list (most likely an empty one)
            if (type === ItemDragTypes.List && !itemWithDragOver.listId && itemWithDragOver.listIndex) {
                const [
                    foundActiveBoardList,
                    foundOverBoardList,
                ] = [
                        copyOfBoardLists?.find(item => item.id === cardBeingDragged?.listId),
                        copyOfBoardLists?.find(item => item.id === itemWithDragOver?.id),
                    ];

                if (!foundActiveBoardList || !foundOverBoardList) return;
                
                const [
                    copyOfCardsForActiveBoardList,
                    copyOfCardsForOverBoardList,
                ] = [
                    foundActiveBoardList.cards.slice(),
                    foundOverBoardList.cards.slice(),
                ];

                foundActiveBoardList.cards = copyOfCardsForActiveBoardList.filter(item => item.id !== cardBeingDragged?.id);
                const copyOfCardBeingDragged = { ...cardBeingDragged };
                copyOfCardBeingDragged.listId = foundOverBoardList.id;

                foundOverBoardList.cards.push(copyOfCardBeingDragged);

                setCurrentBoardDetails(copyOfCurrentBoard);

                // setting a timeout before calling the API incase the user is still holding onto the dragged item
                setTimeout(() => {
                    saveUpdatesToCardOrderInList(
                        foundOverBoardList.cards.map(item => {
                            return {
                                id: item.id,
                                cardIndex: item.cardIndex,
                                listId: item.listId,
                            }
                        }),
                        () => {
                            const boardDetailsCopy: BoardType = JSON.parse(JSON.stringify(currentBoardDetails));
                            const copyOfBoardLists = boardDetailsCopy.lists?.slice();

                            const foundOverBoardList = copyOfBoardLists?.find(item => item.id === itemWithDragOver?.id);
                            if (!foundOverBoardList) return;

                            foundOverBoardList.cards = copyOfCardsForOverBoardList;
                            setCurrentBoardDetails(boardDetailsCopy);
                        },
                    );
                }, 1200);

                return
            }

            // card is being dragged over cards in a different list
            if (itemWithDragOver?.listId !== cardBeingDragged?.listId) {
                const [
                    foundActiveBoardList,
                    foundOverBoardList,
                ] = [
                        copyOfBoardLists?.find(item => item.id === cardBeingDragged?.listId),
                        copyOfBoardLists?.find(item => item.id === itemWithDragOver?.listId),
                    ];

                if (!foundActiveBoardList || !foundOverBoardList) return;

                const [
                    copyOfCardsForActiveBoardList,
                    copyOfCardsForOverBoardList,
                    indexOfItemToReplace,
                ] = [
                        foundActiveBoardList.cards.slice(),
                        foundOverBoardList.cards.slice(),
                        foundOverBoardList.cards.findIndex(item => item.id === itemWithDragOver?.id),
                    ];

                if (indexOfItemToReplace === -1) return;
                if (copyOfCardsForOverBoardList.find(item => item.id === cardBeingDragged?.id)) return;
                
                const copyOfCardBeingDragged = { ...cardBeingDragged };
                copyOfCardBeingDragged.listId = foundOverBoardList.id;
                
                foundActiveBoardList.cards = copyOfCardsForActiveBoardList.filter(item => item.id !== cardBeingDragged?.id);
                foundOverBoardList.cards = [
                    ...copyOfCardsForOverBoardList.slice(0, indexOfItemToReplace),
                    copyOfCardBeingDragged,
                    ...copyOfCardsForOverBoardList.slice(indexOfItemToReplace)
                ];

                setCurrentBoardDetails(copyOfCurrentBoard);

                // setting a timeout before calling the API incase the user is still holding onto the dragged item
                setTimeout(() => {
                    Promise.all([
                        foundActiveBoardList.cards.length > 0 && saveUpdatesToCardOrderInList(
                            foundActiveBoardList.cards.map(item => {
                                return {
                                    id: item.id,
                                    cardIndex: item.cardIndex,
                                    listId: item.listId,
                                }
                            }),
                            () => {
                                const boardDetailsCopy: BoardType = JSON.parse(JSON.stringify(currentBoardDetails));
                                const copyOfBoardLists = boardDetailsCopy.lists?.slice();

                                const foundActiveBoardList = copyOfBoardLists?.find(item => item.id === cardBeingDragged?.listId);
                                if (!foundActiveBoardList) return;

                                foundActiveBoardList.cards = copyOfCardsForActiveBoardList;
                                setCurrentBoardDetails(boardDetailsCopy);
                            }
                        ),
                        saveUpdatesToCardOrderInList(
                            foundOverBoardList.cards.map(item => {
                                return {
                                    id: item.id,
                                    cardIndex: item.cardIndex,
                                    listId: item.listId,
                                }
                            }),
                            () => {
                                const boardDetailsCopy: BoardType = JSON.parse(JSON.stringify(currentBoardDetails));
                                const copyOfBoardLists = boardDetailsCopy.lists?.slice();

                                const foundOverBoardList = copyOfBoardLists?.find(item => item.id === itemToReplace?.listId);
                                if (!foundOverBoardList) return;

                                foundOverBoardList.cards = copyOfCardsForOverBoardList;
                                setCurrentBoardDetails(boardDetailsCopy);
                            }
                        )
                    ])
                }, 1200)
            }
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return resetActiveDragItems();

        if (active.id === over.id) return resetActiveDragItems();

        const { data: { current: itemDragged } } = active;
        const { data: { current: itemToReplace } } = over;

        if (!itemDragged || !itemToReplace) return resetActiveDragItems();

        const copyOfCurrentBoard: BoardType = JSON.parse(JSON.stringify(currentBoardDetails));
        const copyOfBoardLists = copyOfCurrentBoard.lists?.slice();

        if (itemDragged?.item?.id === itemToReplace?.item?.id) return resetActiveDragItems();

        // for cards reordering
        if (activeCardBeingDragged.item !== null) {
            const { item: cardBeingDragged } = itemDragged;
            const { item: cardToReplace } = itemToReplace;

            // cards are being resorted in the same list
            if (cardToReplace?.listId === cardBeingDragged?.listId) {
                const foundBoardList = copyOfBoardLists?.find(item => item.id === cardToReplace?.listId);
                if (!foundBoardList) return resetActiveDragItems();

                const [
                    copyOfCardsForList,
                    indexOfItemDragged,
                    indexOfItemToReplace,
                ] = [
                        foundBoardList.cards.slice(),
                        foundBoardList.cards.findIndex(item => item.id === cardBeingDragged?.id),
                        foundBoardList.cards.findIndex(item => item.id === cardToReplace?.id),
                    ];

                if (indexOfItemDragged === -1 || indexOfItemToReplace === -1) return resetActiveDragItems();

                const cardListingWithDragUpdate = arrayMove(
                    copyOfCardsForList,
                    indexOfItemDragged,
                    indexOfItemToReplace,
                );

                const updatedCardsList = cardListingWithDragUpdate.map((item, index) => {
                    return {
                        ...item,
                        cardIndex: index,
                    }
                })
                const currentCardsList = foundBoardList.cards.slice();

                foundBoardList.cards = updatedCardsList;
                // console.log('updated cards list -> ', updatedCardsList);

                setCurrentBoardDetails(copyOfCurrentBoard);
                resetActiveDragItems();

                saveUpdatesToCardOrderInList(
                    updatedCardsList.map(item => {
                        return {
                            id: item.id,
                            cardIndex: item.cardIndex,
                            listId: item.listId,
                        }
                    }),
                    () => {
                        const boardDetailsCopy: BoardType = JSON.parse(JSON.stringify(currentBoardDetails));
                        const copyOfBoardLists = boardDetailsCopy.lists?.slice();

                        const foundBoardList = copyOfBoardLists?.find(item => item.id === cardToReplace?.listId);
                        if (!foundBoardList) return;

                        foundBoardList.cards = currentCardsList;
                        setCurrentBoardDetails(boardDetailsCopy);
                    }
                );

                return;
            }

            return resetActiveDragItems();

        }

        // for lists reordering
        if (activeListBeingDragged.item !== null) {
            const { item: listBeingDragged } = itemDragged;
            const { item: listToReplace } = itemToReplace;

            const [
                indexOfItemDragged,
                indexOfItemToReplace,
            ] = [
                    copyOfBoardLists.findIndex(item => item.id === listBeingDragged?.id),
                    copyOfBoardLists.findIndex(item => item.id === listToReplace?.id),
                ]

            if (indexOfItemDragged === -1 || indexOfItemToReplace === -1) return resetActiveDragItems();

            const updatedBoardListingWithDragUpdates = arrayMove(
                copyOfBoardLists,
                indexOfItemDragged,
                indexOfItemToReplace,
            );

            const updatedBoardListing = updatedBoardListingWithDragUpdates.map((item, index) => {
                return {
                    ...item,
                    listIndex: index,
                }
            });

            copyOfCurrentBoard.lists = updatedBoardListing;
            // console.log('updated board lists -> ', updatedBoardListing);

            setCurrentBoardDetails(copyOfCurrentBoard);
            resetActiveDragItems();

            setTimeout(() => {
                saveUpdatesToListOrderInBoard(
                    {
                        lists: updatedBoardListing.map(item => {
                            return {
                                id: item.id,
                                listIndex: item.listIndex,
                            }
                        })
                    },
                    () => {
                        const boardDetailsCopy: BoardType = JSON.parse(JSON.stringify(currentBoardDetails));
                        boardDetailsCopy.lists = copyOfBoardLists;

                        setCurrentBoardDetails(boardDetailsCopy);
                    }
                )
            }, 800);

            return
        }
    }

    if (!currentBoardDetails) return <></>

    return (
        <DndContext
            collisionDetection={closestCorners}
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
        >
            <section className={styles.board__Canvas}>
                <>
                    <SortableContext
                        items={currentBoardDetails.lists}
                        strategy={horizontalListSortingStrategy}
                    >
                        {
                            React.Children.toArray(currentBoardDetails.lists?.map(list => {
                                return <BoardList
                                    list={list}
                                />
                            }))
                        }
                    </SortableContext>
                </>

                <NewCanvasItem
                    inputValue={newListName}
                    handleUpdateDetail={(name, val) => setNewListName(val)}
                    placeholder='Enter a title for this list...'
                    handleAddNewCanvasItem={handleAddNewList}
                    loading={newListLoading}
                    handleToggleModal={setShowNewListModal}
                    itemType='list'
                    showAddNewModal={showNewListModal}
                    showAddNewBtn={
                        (currentBoardDetails.creatorId === session?.user.id || currentBoardDetails.members?.find(member => member.userId === session?.user.id)) ?
                            true
                            :
                            false
                    }
                />
            </section>

            {
                createPortal(
                    <DragOverlay>
                        {
                            activeCardBeingDragged.item && activeCardBeingDragged.type === ItemDragTypes.Card ? (
                                <>
                                    <ListCard
                                        card={activeCardBeingDragged.item}
                                    />
                                </>
                            )
                                :
                                null
                        }

                        {
                            activeListBeingDragged.item && activeListBeingDragged.type === ItemDragTypes.List ? (
                                <>
                                    <BoardList
                                        list={activeListBeingDragged.item}
                                    />
                                </>
                            )
                                :
                                null
                        }
                    </DragOverlay>,
                    document.body
                )
            }
        </DndContext>
    )
}

export default BoardCanvas