"use client";

import { useAppContext } from '@contexts/AppContext';
import React, { useEffect } from 'react'
import styles from './styles.module.css'
import BoardCard from '@components/BoardCard/BoardCard';
import Spinner from '@components/Spinner/Spinner';
import { getSavedInviteDetailsFromStorage } from '@utils/utils';
import { useRouter } from 'next/navigation';

const BoardsLandingListing = () => {
    const {
        allBoards,
        allBoardsLoading,
        setCurrentBoardDetails,
    } = useAppContext();

    const router = useRouter();

    useEffect(() => {
        setCurrentBoardDetails(null);

        const savedInviteDetails = getSavedInviteDetailsFromStorage();
        if (savedInviteDetails) return router.push(`/boards/invite?id=${savedInviteDetails.item}&type=${savedInviteDetails.inviteType}&boardId=${savedInviteDetails.boardId}`)
    }, [])

    if (allBoardsLoading) return <div style={{
        margin: '0 auto',
        width: 'max-content'
    }}>
        <Spinner />
    </div>

    return (
        <section className={styles.all__Boards__Wrap}>
            {
                allBoards.length < 1 ? <>
                    You do not have any boards yet
                </> : <>
                    {
                        React.Children.toArray(allBoards.map(board => {
                            return <BoardCard
                                board={board}
                            />
                        }))
                    }
                </>
            }
        </section>
    )
}

export default BoardsLandingListing