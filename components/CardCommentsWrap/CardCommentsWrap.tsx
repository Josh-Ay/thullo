import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import CustomButton from '@components/CustomButton/CustomButton'
import { notoSans } from '@app/layout'
import CommentItem from './components/CommentItem'
import { CardService } from '@services/cardService'
import { useAppContext } from '@contexts/AppContext'
import Spinner from '@components/Spinner/Spinner'


const CardCommentsWrap = ({
    card,
}: {
    card: CardType,
}) => {
    const { data: session } = useSession();

    const [newCommentText, setNewCommentText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [commentsLoaded, setCommentsLoaded] = useState<boolean>(false);
    const [commentsLoading, setCommentsLoading] = useState<boolean>(true);

    const {
        currentBoardDetails,
        setCurrentBoardDetails,
        allBoards,
        setAllBoards,
    } = useAppContext();

    const cardService = new CardService();

    useEffect(() => {
        if (commentsLoaded) return setCommentsLoading(false);

        setCommentsLoading(true);
        setCommentsLoaded(false);

        cardService.getAllCardComments(card.id).then(res => {
            updateCardComments({
                updateAll: true,
                allComments: res,
            });
            setCommentsLoading(false);
            setCommentsLoaded(true);
        }).catch((err) => {
            setCommentsLoading(false);
        })
    }, [])

    const updateCardComments = ({
        updateAll = false,
        addNew = false,
        commentDetail = null,
        allComments = [],
        updateExisting = false,
        deleteExisting = false,
    }: {
        updateAll?: boolean,
        addNew?: boolean,
        commentDetail?: CommentType | null,
        allComments?: CommentType[],
        updateExisting?: boolean,
        deleteExisting?: boolean,
    }) => {
        const copyOfAllBoards: BoardType[] = allBoards.slice();

        const currentBoard = copyOfAllBoards?.find(item => item.lists.find(list => list.id === card.listId));
        if (!currentBoard) return;

        const foundCardListing = currentBoard?.lists?.find(item => item.id === card.listId);
        if (!foundCardListing) return;

        const cardFound = foundCardListing.cards.find(item => item.id === card.id);
        if (!cardFound) return;

        if (addNew === true) {
            const currentCardComments = cardFound.comments?.slice() ?? [];

            if (commentDetail) currentCardComments?.unshift(commentDetail);

            cardFound.comments = currentCardComments;
            cardFound.totalComments += 1;
        }

        if (updateAll === true) {
            cardFound.comments = allComments;
            cardFound.totalComments = allComments.length;
        }

        if (updateExisting === true && commentDetail) {
            const currentCardComments = cardFound.comments?.slice() ?? [];
            const foundCommentIndex = currentCardComments.findIndex(item => item.id === commentDetail?.id);
            if (foundCommentIndex !== -1) {
                const currentCommentDetail = currentCardComments[foundCommentIndex];
                currentCardComments[foundCommentIndex] = {
                    ...currentCommentDetail,
                    ...commentDetail,
                };
                cardFound.comments = currentCardComments;
            }
        }

        if (deleteExisting === true && commentDetail) {
            const currentCardComments = cardFound.comments?.slice() ?? [];

            cardFound.comments = currentCardComments.filter(comment => comment.id !== commentDetail.id);
            cardFound.totalComments -= 1;
        }

        setCurrentBoardDetails(currentBoard);
        setAllBoards(copyOfAllBoards);
    }

    const handleSaveComment = async () => {
        setLoading(true);

        try {
            const res = await cardService.addNewCardComment({
                comment: newCommentText,
                cardId: card.id
            });

            updateCardComments({ addNew: true, commentDetail: res });
            setLoading(false);
            setNewCommentText('');
        } catch (error) {
            setLoading(false);
        }
    }

    if (commentsLoading) return <div style={{
        padding: '1rem',
        width: 'max-content',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        justifyContent: 'flex-start',
        alignItems: 'center'
    }}>
        <Spinner />
        <p style={{ fontSize: '0.625rem' }}>Loading comments...</p>
    </div>

    return (
        <section className={styles.comment__Wrap}>
            {
                (!card.members?.find(item => item.userId === session?.user.id)) &&
                    (card.creatorId !== session?.user.id) &&
                    (currentBoardDetails?.creatorId !== session?.user?.id) ? <></>
                    :
                    <section className={styles.new__Comment__Wrap}>
                        <section className={styles.new__Comment}>
                            <Image
                                src={session?.user?.image ?? ''}
                                alt="user photo"
                                width={28}
                                height={28}
                                className={styles.profile__Img}
                            />

                            <textarea
                                rows={2}
                                className={notoSans.className}
                                placeholder='Write a comment...'
                                value={newCommentText}
                                onChange={({ target }) => setNewCommentText(target.value)}
                            ></textarea>
                        </section>

                        <CustomButton
                            title={loading ? 'Please wait...' : 'Comment'}
                            width='max-content'
                            margin='0 0 0 auto'
                            handleClick={handleSaveComment}
                            disabled={loading}
                        />
                    </section>
            }

            <section className={styles.all__comments__Wrap}>
                {
                    (!card.comments || !Array.isArray(card.comments)) ?
                        <></>
                        :
                        React.Children.toArray(card?.comments?.map(commentItem => {
                            return <CommentItem
                                comment={commentItem}
                                updateComments={updateCardComments}
                            />
                        }))
                }
            </section>
        </section>
    )
}

export default CardCommentsWrap