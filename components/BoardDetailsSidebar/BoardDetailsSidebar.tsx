import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { IoClose } from 'react-icons/io5';
import { MdAccountCircle, MdEdit } from 'react-icons/md';
import { formatDateAndTimeForApp } from '@utils/utils';
import Image from 'next/image';
import { notoSans } from '@app/layout';
import { AiFillFileText } from 'react-icons/ai';
import CustomButton from '@components/CustomButton/CustomButton';
import { useAppContext } from '@contexts/AppContext';
import { BoardService } from '@services/boardService';
import { useSession } from 'next-auth/react';
import SectionTitleWithIcon from '@components/SectionTitleWithIcon/SectionTitleWithIcon';
import MembersList from '@components/MembersList/MembersList';


const BoardDetailsSidebar = ({
    handleCloseSidebar = () => { },
}: {
    handleCloseSidebar: () => void,
}) => {
    const [copyOfCurrentBoardDetails, setCopyOfCurrentBoardDetails] = useState<BoardType | null>(null);
    const [editModeActive, setEditModeActive] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const { data: session } = useSession();

    const {
        allBoards,
        setAllBoards,
        currentBoardDetails,
        setCurrentBoardDetails,
    } = useAppContext();

    const boardService = new BoardService();


    useEffect(() => {
        setCopyOfCurrentBoardDetails(currentBoardDetails);
    }, [currentBoardDetails])

    const handleSaveDetails = async () => {
        if (!copyOfCurrentBoardDetails?.id) return;

        setLoading(true);

        const copyOfAllBoards: BoardType[] = allBoards.slice();

        try {
            const res: BoardType = await boardService.updateSingleBoardDetails(copyOfCurrentBoardDetails?.id, {
                title: copyOfCurrentBoardDetails?.title,
                description: copyOfCurrentBoardDetails?.description ?? '',
                visibility: copyOfCurrentBoardDetails?.visibility,
            });

            setLoading(false);

            const foundBoardIndex = copyOfAllBoards.findIndex(board => board.id === copyOfCurrentBoardDetails?.id);
            if (foundBoardIndex === -1) return;

            copyOfAllBoards[foundBoardIndex] = res;
            setAllBoards(copyOfAllBoards);

            setCurrentBoardDetails(res);
            setCopyOfCurrentBoardDetails(res);

            setEditModeActive(false);
        } catch (error) {
            setLoading(false);
        }
    }

    const handleCancelEdit = () => {
        setCopyOfCurrentBoardDetails(currentBoardDetails);
        setEditModeActive(false);
    }

    const handleRemoveMember = async (userIdToRemove: string) => {

    }

    if (!copyOfCurrentBoardDetails) return <></>

    return <>
        <section className={styles.board__Details__Sidebar}>
            <section className={styles.top__Row__Wrap}>
                <section className={styles.top__Row}>
                    <h3>Menu</h3>

                    <IoClose
                        size={'1.5rem'}
                        cursor={'pointer'}
                        onClick={handleCloseSidebar}
                    />
                </section>
                <section className={styles.creator__Title}>
                    <MdAccountCircle
                        size={'0.875rem'}
                    />
                    <p>Made By</p>
                </section>

                <section className={styles.creator__Wrap}>
                    <Image
                        src={copyOfCurrentBoardDetails?.creator?.profilePhoto ?? copyOfCurrentBoardDetails?.creator?.image ?? ''}
                        alt='creator image'
                        width={0}
                        height={0}
                        sizes='100vw'
                        className={styles.creator__Img}
                        style={{
                            objectFit: 'cover',
                        }}
                    />

                    <section className={styles.creator__Details}>
                        <h5>{copyOfCurrentBoardDetails?.creator?.name}</h5>
                        <p className={notoSans.className}>on {formatDateAndTimeForApp(copyOfCurrentBoardDetails?.createdAt ?? '')}</p>
                    </section>
                </section>
            </section>

            <section className={styles.description__Wrap}>
                <section className={styles.description__Title__Wrap}>
                    <SectionTitleWithIcon
                        icon={AiFillFileText}
                        title='Description'
                    />

                    {
                        editModeActive ? <></>
                            :
                            <>
                                {
                                    currentBoardDetails?.creatorId === session?.user.id ?
                                        <CustomButton
                                            icon={MdEdit}
                                            title='Edit'
                                            border='1px solid #BDBDBD'
                                            backgroundColor='transparent'
                                            borderRadius='8px'
                                            color='#828282'
                                            fontSize='0.625rem'
                                            iconSize='0.875rem'
                                            padding='0.238rem 0.63rem'
                                            className={styles.edit__Btn}
                                            gap='0.5rem'
                                            handleClick={() => setEditModeActive(true)}
                                        />
                                        :
                                        <></>
                                }
                            </>
                    }
                </section>

                <>
                    {
                        editModeActive ?
                            <>
                                <textarea
                                    className={`${notoSans.className} ${styles.description}`}
                                    rows={14}
                                    placeholder='Enter description here. Use *word* for bold text'
                                    value={copyOfCurrentBoardDetails.description}
                                    onChange={({ target }) => setCopyOfCurrentBoardDetails((prevDetails) => {
                                        if (!prevDetails) return null;

                                        return {
                                            ...prevDetails,
                                            description: target.value,
                                        }
                                    })}
                                ></textarea>

                                <div className={styles.actions__Wrap}>
                                    <CustomButton
                                        title={loading ? 'Saving...' : 'Save'}
                                        backgroundColor='#219653'
                                        handleClick={handleSaveDetails}
                                        width='max-content'
                                        disabled={loading}
                                    />

                                    <CustomButton
                                        title={'Cancel'}
                                        backgroundColor='transparent'
                                        handleClick={handleCancelEdit}
                                        width='max-content'
                                        disabled={loading}
                                        color='#828282'
                                    />
                                </div>
                            </>
                            :
                            <>
                                <p
                                    className={`${notoSans.className} ${styles.description__Text}`}
                                    dangerouslySetInnerHTML={{
                                        __html: copyOfCurrentBoardDetails?.description?.replace(/\*(.*?)\*/g, '<strong>$1</strong>') ?? ""
                                    }}
                                >
                                </p>
                            </>
                    }
                </>
            </section>

            <section className={styles.members__Wrap}>
                <SectionTitleWithIcon
                    title='Team'
                    icon={AiFillFileText}
                />

                <MembersList
                    members={copyOfCurrentBoardDetails.members ?? []}
                    isListOwner={session?.user?.id === copyOfCurrentBoardDetails.creator?.id}
                    listOwnerId={copyOfCurrentBoardDetails.creator?.id}
                    showMemberActions={true}
                    handleRemoveMember={handleRemoveMember}
                />
            </section>
        </section>
    </>
}

export default BoardDetailsSidebar