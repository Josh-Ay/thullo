import React, { useEffect, useRef, useState } from 'react'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import styles from './styles.module.css'
import NewCanvasItem from '@components/NewCanvasItem/NewCanvasItem'
import { useAppContext } from '@contexts/AppContext'
import { CardService } from '@services/cardService'
import ListCard from '@components/ListCard/ListCard'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from "@dnd-kit/utilities"
import { ItemDragTypes } from '@components/BoardCanvas/utils'
import CustomHr from '@components/CustomHr/CustomHr'
import useClickOutside from '@hooks/useClickOutside'
import { notoSans } from '@app/layout'
import CustomButton from '@components/CustomButton/CustomButton'
import { ListService } from '@services/listService'
import { useSession } from 'next-auth/react'

const BoardList = ({
    list,
}: {
    list: ListType,
}) => {
    const { data: session } = useSession();

    const [newCardName, setNewCardName] = useState<string>('');
    const [listName, setListName] = useState<string>('');
    const [showNewCardModal, setShowNewCardModal] = useState<boolean>(false);
    const [newCardLoading, setNewCardLoading] = useState<boolean>(false);
    const [showListOptionModal, setShowListOptionModal] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const listOptionRef = useRef<HTMLUListElement>(null);

    const {
        allBoards,
        setAllBoards,
        currentBoardDetails,
        setCurrentBoardDetails,
    } = useAppContext();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useSortable({
        id: list.id,
        data: {
            type: ItemDragTypes.List,
            item: list,
        },
        disabled: (!session || !session.user) ? true : false,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const cardService = new CardService();
    const listService = new ListService();

    useClickOutside({
        elemRef: listOptionRef,
        handleClickOutside: () => handleCancelBtnClick(),
    });

    useEffect(() => {
        setListName(list.title);
    }, [list])

    const handleAddNewCard = async () => {
        if (newCardName.length < 1 || newCardLoading) return;

        setNewCardLoading(true);

        try {
            const newCardData = await cardService.createNewCard({
                title: newCardName,
                listId: list.id,
            });

            setNewCardLoading(false);
            setNewCardName('');
            setShowNewCardModal(false);

            const copyOfAllBoards: BoardType[] = allBoards.slice();
            const foundParentBoard = copyOfAllBoards.find(item => item.id === list.boardId);

            if (!foundParentBoard) return;

            const copyOfBoardLists = foundParentBoard.lists?.slice();
            const foundEditedListItem = copyOfBoardLists?.find(item => item.id === list.id);

            if (!foundEditedListItem) return;

            foundEditedListItem.cards.push(newCardData);
            foundParentBoard.lists = copyOfBoardLists;

            setCurrentBoardDetails(foundParentBoard);
            setAllBoards(copyOfAllBoards);

        } catch (error) {
            setNewCardLoading(false);
        }
    }

    const handleSaveDetails = async () => {
        setLoading(true);

        try {
            const res = await listService.updateListDetail(list.id, {
                title: listName,
                boardId: list.boardId,
            });

            const copyOfAllBoards: BoardType[] = allBoards.slice();

            const foundParentBoard = copyOfAllBoards.find(item => item.id === list.boardId);
            if (!foundParentBoard) return;

            const copyOfBoardLists = foundParentBoard.lists?.slice();

            const foundEditedListItemIndex = copyOfBoardLists?.findIndex(item => item.id === list.id);
            if (foundEditedListItemIndex === -1) return;

            copyOfBoardLists[foundEditedListItemIndex] = res;
            foundParentBoard.lists = copyOfBoardLists;

            setCurrentBoardDetails(foundParentBoard);
            setAllBoards(copyOfAllBoards);

            setLoading(false);
            handleCancelBtnClick();
        } catch (error) {
            setLoading(false);
        }
    }

    const handleDeleteList = async () => {
        setLoading(true);

        try {
            await listService.deleteList(list.id, {
                boardId: currentBoardDetails?.id,
            });

            const copyOfAllBoards: BoardType[] = allBoards.slice();

            const foundParentBoard = copyOfAllBoards.find(item => item.id === list.boardId);
            if (!foundParentBoard) return;

            const copyOfBoardLists = foundParentBoard.lists?.slice();
            foundParentBoard.lists = copyOfBoardLists.filter(item => item.id !== list.id);

            setCurrentBoardDetails(foundParentBoard);
            setAllBoards(copyOfAllBoards);

            setLoading(false);
            handleCancelBtnClick();
        } catch (error) {
            setLoading(false);
        }
    }

    const handleCancelBtnClick = () => {
        setEditMode(false);
        setShowListOptionModal(false);
        setDeleteMode(false);
    }

    if (isDragging) return (
        <section
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`${styles.list__Item} ${styles.is__Dragging}`}
            id={list.id}
        >
            <NewCanvasItem
                isDragging={true}
            />
        </section>
    )

    return (
        <section
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={styles.list__Item}
            id={list.id}
        >
            <section className={styles.title__Row}>
                <h4>{list.title}</h4>

                {
                    (
                        (currentBoardDetails?.creatorId === session?.user.id) ||
                        (currentBoardDetails?.members?.find(member => member.userId === session?.user.id) !== undefined)
                    ) ?
                        <HiOutlineDotsHorizontal
                            cursor={'pointer'}
                            onClick={() => setShowListOptionModal(true)}
                        />
                        :
                        <></>
                }

                {
                    showListOptionModal && <>
                        <ul
                            className={styles.board__List__Options}
                            ref={listOptionRef}
                        >
                            {
                                (deleteMode || editMode) ? <>
                                    {
                                        deleteMode ? <>
                                            <p className={`${notoSans.className} ${styles.delete__Confirm__Txt}`}>Are you sure you want to delete '{list.title}'?</p>
                                        </> : <>
                                            <input
                                                value={listName}
                                                onChange={({ target }) => setListName(target.value)}
                                                className={`${notoSans.className} ${styles.list__Name__Input}`}
                                                placeholder='Enter list name'
                                            />
                                        </>
                                    }


                                    <div className={styles.actions__Wrap}>
                                        <CustomButton
                                            title={
                                                loading ?
                                                    deleteMode ? 
                                                    'Deleting...' 
                                                    : 
                                                    'Saving...' 
                                                : 
                                                deleteMode ?
                                                    'Delete'
                                                :
                                                'Save'
                                            }
                                            backgroundColor={deleteMode ? '#EB5757' : '#219653'}
                                            handleClick={
                                                deleteMode ? 
                                                    () => handleDeleteList() 
                                                : 
                                                () => handleSaveDetails()
                                            }
                                            width='max-content'
                                            disabled={loading}
                                        />

                                        <CustomButton
                                            title={'Cancel'}
                                            backgroundColor='transparent'
                                            handleClick={handleCancelBtnClick}
                                            width='max-content'
                                            disabled={loading}
                                            color='#828282'
                                        />
                                    </div>
                                </> : <>

                                    <li onClick={() => setEditMode(true)}>Rename</li>

                                    <CustomHr />

                                    <li onClick={() => setDeleteMode(true)}>Delete this list</li>
                                </>
                            }
                        </ul>
                    </>
                }
            </section>

            <SortableContext
                items={list.cards}
                strategy={verticalListSortingStrategy}
            >
                {
                    React.Children.toArray(list.cards?.map(card => {
                        return <ListCard card={card} />
                    }))
                }
            </SortableContext>

            <NewCanvasItem
                inputValue={newCardName}
                handleUpdateDetail={(name, val) => setNewCardName(val)}
                placeholder='Enter a title for this card...'
                handleAddNewCanvasItem={handleAddNewCard}
                loading={newCardLoading}
                showAddNewModal={showNewCardModal}
                handleToggleModal={setShowNewCardModal}
                itemType='card'
                showAddNewBtn={
                    (currentBoardDetails?.creatorId === session?.user.id || currentBoardDetails?.members?.find(member => member.userId === session?.user.id)) ?
                        true
                        :
                        false
                }
            />
        </section>
    )
}

export default BoardList