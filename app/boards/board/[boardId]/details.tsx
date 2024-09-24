"use client";

import CustomButton from '@components/CustomButton/CustomButton';
import styles from './styles.module.css';
import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '@contexts/AppContext';
import Spinner from '@components/Spinner/Spinner';
import { visibilityOptions } from '@components/BoardVisibilitySelector/utils';
import { notoSans } from '@app/layout';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoIosAdd } from 'react-icons/io';
import BoardCanvas from '@components/BoardCanvas/BoardCanvas';
import BoardVisibilitySelector from '@components/BoardVisibilitySelector/BoardVisibilitySelector';
import { BoardService } from '@services/boardService';
import BoardDetailsSidebar from '@components/BoardDetailsSidebar/BoardDetailsSidebar';
import useClickOutside from '@hooks/useClickOutside';
import InviteMemberWrap from '@components/InviteMemberWrap/InviteMemberWrap';
import { ValidInviteTypes } from '@lib/validators/user';
import { useSession } from 'next-auth/react';
import ProfilePhotoItem from '@components/ProfilePhotoItem/ProfilePhotoItem';

const maxBoardMembersToDisplay = 5;

const SingleBoardPageDetails = ({
    boardId,
}: {
    boardId: string,
}) => {
    const {
        allBoards,
        allBoardsLoaded,
        setAllBoards,
        setAllBoardsLoaded,
        currentBoardDetails,
        setCurrentBoardDetails,
    } = useAppContext();

    const { data: session, status } = useSession();

    const [boardLoading, setBoardLoading] = useState(true);
    const [copyOfCurrentBoardDetails, setCopyOfCurrentBoardDetails] = useState<BoardType | null>(null);
    const [showBoardVisibilityModal, setShowBoardVisibilityModal] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [showBoardDetails, setShowBoardDetails] = useState(false);
    const [showBoardInviteModal, setShowBoardInviteModal] = useState(false);

    const visibilityWrapRef = useRef<HTMLDivElement>(null);
    const boardDetailsRef = useRef<HTMLDivElement>(null);
    const boardInviteModalRef = useRef<HTMLDivElement>(null);

    const boardService = new BoardService();

    useClickOutside({
        elemRef: visibilityWrapRef,
        handleClickOutside: () => setShowBoardVisibilityModal(false),
    });

    useClickOutside({
        elemRef: boardDetailsRef,
        handleClickOutside: () => setShowBoardDetails(false),
    });

    useClickOutside({
        elemRef: boardInviteModalRef,
        handleClickOutside: () => setShowBoardInviteModal(false),
    });

    useEffect(() => {
        if (!allBoardsLoaded) {
            boardService.getSingleBoardDetails(boardId).then(res => {
                setCurrentBoardDetails(res);
                if (status !== "loading" && status === "unauthenticated") {
                    setAllBoards([res]);
                    setAllBoardsLoaded(true);
                }
                setBoardLoading(false);
            }).catch(err => {
                // console.log(err);
                setBoardLoading(false);
            })

            return;
        }

        const foundBoard = allBoards.find(board => board.id === boardId);
        if (!foundBoard) {
            setCurrentBoardDetails(null);
            setBoardLoading(false);
            return
        }

        setCurrentBoardDetails(foundBoard);
        setBoardLoading(false);

    }, [status])

    useEffect(() => {
        setCopyOfCurrentBoardDetails(currentBoardDetails);
    }, [currentBoardDetails])

    const handleUpdateBoardVisibility = (newVisibility: string) => {
        setCopyOfCurrentBoardDetails((prevDetails) => {
            if (!prevDetails) return null;

            return {
                ...prevDetails,
                visibility: newVisibility
            }
        })
    }

    const handleCancelUpdateVisibilityUpdate = () => {
        setCopyOfCurrentBoardDetails(currentBoardDetails);
        setShowBoardVisibilityModal(false);
    }

    const handleUpdateVisibility = async () => {
        if (!copyOfCurrentBoardDetails?.id) return;

        setUpdateLoading(true);

        const copyOfAllBoards: BoardType[] = allBoards.slice();

        try {
            const res: BoardType = await boardService.updateSingleBoardDetails(copyOfCurrentBoardDetails?.id, {
                title: copyOfCurrentBoardDetails?.title,
                description: copyOfCurrentBoardDetails?.description ?? '',
                visibility: copyOfCurrentBoardDetails?.visibility,
            });

            setUpdateLoading(false);

            const foundBoardIndex = copyOfAllBoards.findIndex(board => board.id === copyOfCurrentBoardDetails?.id);
            if (foundBoardIndex === -1) return;

            copyOfAllBoards[foundBoardIndex] = res;
            setAllBoards(copyOfAllBoards);
            setCurrentBoardDetails(res);

            setShowBoardVisibilityModal(false);
        } catch (error) {
            setUpdateLoading(false);
        }

    }

    return <>
        <section className={styles.single__Board__Page}>
            {
                boardLoading ?
                    <>
                        <div style={{
                            margin: '0 auto',
                            width: 'max-content',
                        }}>
                            <Spinner />
                        </div>
                    </>
                    :
                    !currentBoardDetails ?
                        <></>
                        :
                        <>
                            <section className={styles.board__Top__Section}>
                                <section className={styles.board__Top__Info}>
                                    <div style={{
                                        position: 'relative',
                                        width: 'max-content',
                                    }}>
                                        <CustomButton
                                            icon={
                                                visibilityOptions.find(item => item.value === currentBoardDetails?.visibility)?.icon
                                            }
                                            backgroundColor='#F2F2F2'
                                            color='#828282'
                                            title={
                                                visibilityOptions.find(item => item.value === currentBoardDetails?.visibility)?.title
                                            }
                                            iconSize='0.75rem'
                                            fontSize='0.75rem'
                                            padding='0.54rem 1.3rem'
                                            gap='0.5rem'
                                            width='max-content'
                                            disabled={session?.user.id !== currentBoardDetails.creatorId}
                                            cursor={session?.user.id === currentBoardDetails.creatorId ? 'cursor' : 'default'}
                                            handleClick={() => setShowBoardVisibilityModal(!showBoardVisibilityModal)}
                                        />

                                        {
                                            showBoardVisibilityModal &&
                                            <div ref={visibilityWrapRef}>
                                                <BoardVisibilitySelector
                                                    className={styles.board__Visibility__Selector}
                                                    selectedVisibility={copyOfCurrentBoardDetails?.visibility}
                                                    handleSelectVisibilty={(visibilitySelected: string) => handleUpdateBoardVisibility(visibilitySelected)}
                                                    showActionBtns={true}
                                                    handleCancelBtnClick={handleCancelUpdateVisibilityUpdate}
                                                    handleSaveBtnClick={handleUpdateVisibility}
                                                    loading={updateLoading}
                                                />
                                            </div>
                                        }
                                    </div>

                                    <section className={styles.members__Wrap}>
                                        {
                                            !currentBoardDetails?.members ? <></>
                                                :
                                                React.Children.toArray(currentBoardDetails.members?.slice(0, maxBoardMembersToDisplay)?.map(member => {
                                                    return <ProfilePhotoItem
                                                        userImage={member?.user?.profilePhoto ?? member?.user?.image ?? ''}
                                                        profileLink={`/profile/${member.userId}`}
                                                    />
                                                }))
                                        }

                                        {
                                            currentBoardDetails?.members && currentBoardDetails?.members?.length > maxBoardMembersToDisplay &&
                                            <>
                                                <p className={`${notoSans.className} ${styles.other__Members}`}>+ {currentBoardDetails?.members?.slice(maxBoardMembersToDisplay)?.length} others</p>
                                            </>
                                        }

                                        {
                                            currentBoardDetails?.creatorId === session?.user.id &&
                                            <CustomButton
                                                icon={IoIosAdd}
                                                iconSize='1.5rem'
                                                padding='0.25rem'
                                                handleClick={() => setShowBoardInviteModal(true)}
                                            />
                                        }

                                        {
                                            showBoardInviteModal &&
                                            <div ref={boardInviteModalRef}>
                                                <InviteMemberWrap
                                                    title='Invite to Board'
                                                    className={styles.board__Invite__Wrap}
                                                    board={currentBoardDetails}
                                                    inviteType={ValidInviteTypes.boardInvite}
                                                    handleCloseModal={() => setShowBoardInviteModal(false)}
                                                    excludedMemberId={[currentBoardDetails?.creatorId]}
                                                />
                                            </div>
                                        }
                                    </section>
                                </section>

                                <CustomButton
                                    icon={HiOutlineDotsHorizontal}
                                    backgroundColor='#F2F2F2'
                                    color='#828282'
                                    title={'Show Menu'}
                                    iconSize='0.75rem'
                                    fontSize='0.75rem'
                                    padding='0.54rem 1.3rem'
                                    gap='0.5rem'
                                    width='max-content'
                                    handleClick={() => setShowBoardDetails(true)}
                                    className={styles.menu__Info__Btn}
                                />
                            </section>

                            <BoardCanvas />

                            {
                                showBoardDetails &&
                                <div ref={boardDetailsRef}>
                                    <BoardDetailsSidebar
                                        handleCloseSidebar={() => setShowBoardDetails(false)}
                                    />
                                </div>
                            }
                        </>
            }
        </section>
    </>
}

export default SingleBoardPageDetails;