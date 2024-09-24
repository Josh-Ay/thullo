import React, { useEffect, useState } from 'react'
import styles from '../styles.module.css'
import Image from 'next/image'
import { formatCommentDate } from '@utils/utils'
import { notoSans } from '@app/layout'
import CustomHr from '@components/CustomHr/CustomHr'
import CustomButton from '@components/CustomButton/CustomButton'
import { CardService } from '@services/cardService'
import { useSession } from 'next-auth/react'

const CommentItem = ({
    comment,
    updateComments = ({ }) => { },
}: {
    comment: CommentType,
    updateComments: ({ }) => void,
}) => {
    const { data: session } = useSession();

    const [loading, setLoading] = useState(false);
    const [editModeActive, setEditModeActive] = useState(false);
    const [commentTextCopy, setCommentTextCopy] = useState('');

    const cardService = new CardService();

    useEffect(() => {
        setCommentTextCopy(comment.comment);
    }, [comment])

    const handleSaveDetails = async () => {
        setLoading(true);

        try {
            const updatedComment = await cardService.updateCardComment(comment.id, {
                comment: commentTextCopy,
            });

            updateComments({
                updateExisting: true,
                commentDetail: updatedComment,
            });

            setLoading(false);
            handleCancelEdit();
        } catch (error) {
            setLoading(false);
        }
    }

    const handleCancelEdit = () => {
        setEditModeActive(false);
        setCommentTextCopy(comment.comment);
    }

    const handleDeleteComment = async () => {
        setLoading(true);

        try {
            await cardService.deleteComment(comment.id);

            setLoading(false);

            updateComments({
                deleteExisting: true,
                commentDetail: comment,
            });
        } catch (error) {
            setLoading(false);
        }
    }

    return <section className={styles.comment__Item}>
        <section className={styles.comment__Author__Item}>
            <section className={styles.comment__Author__Wrap}>
                <Image
                    src={comment?.author?.profilePhoto ?? ''}
                    alt="user photo"
                    width={28}
                    height={28}
                    className={styles.profile__Img}
                />

                <section className={styles.comment__Author__Details}>
                    <h3 className={styles.author}>{comment?.author?.name}</h3>
                    <p className={`${notoSans.className} ${styles.comment__Date}`}>
                        <span>{formatCommentDate(comment.createdAt)}</span>
                        {
                            comment.updatedAt && new Date(comment.createdAt).getTime() !== new Date(comment.updatedAt).getTime() &&
                            <>
                                <span>|</span>
                                <span>Last edited on {formatCommentDate(comment.updatedAt)}</span>
                            </>
                        }
                    </p>
                </section>
            </section>

            <section className={styles.comment__Actions}>
                {
                    comment.authorId === session?.user.id ? <>
                        <CustomButton
                            title={'Edit'}
                            backgroundColor='transparent'
                            color='#000'
                            handleClick={() => setEditModeActive(true)}
                            width='max-content'
                            disabled={loading}
                            padding='0'
                        />

                        <span>-</span>

                        <CustomButton
                            title={((commentTextCopy === comment.comment) && (loading)) ? 'Deleting...' : 'Delete'}
                            color='#000'
                            backgroundColor='transparent'
                            handleClick={() => handleDeleteComment()}
                            width='max-content'
                            disabled={loading}
                            padding='0'
                        />
                    </> : <></>
                }
            </section>
        </section>

        <>
            {
                editModeActive ?
                    <>
                        <textarea
                            className={`${notoSans.className} ${styles.edit__Comment}`}
                            rows={2}
                            placeholder='Enter description here. Use *word* for bold text'
                            value={commentTextCopy}
                            onChange={({ target }) => setCommentTextCopy(target.value)}
                        ></textarea>

                        <div className={styles.comment__Actions}>
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
                            className={`${notoSans.className} ${styles.comment__Text}`}
                            dangerouslySetInnerHTML={{
                                __html: comment?.comment?.replace(/\*(.*?)\*/g, '<strong>$1</strong>') ?? ""
                            }}
                        >
                        </p>
                    </>
            }
        </>

        <CustomHr />
    </section>
}

export default CommentItem