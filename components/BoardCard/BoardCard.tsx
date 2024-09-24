import React from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import { notoSans } from '@app/layout';
import Link from 'next/link';
import ProfilePhotoItem from '@components/ProfilePhotoItem/ProfilePhotoItem';

export const sampleImg = 'https://images.unsplash.com/photo-1719937051230-8798ae2ebe86?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const BoardCard = ({
    board,
}: {
    board: BoardType,
}) => {
    return (
        <Link
            className={styles.board__Card__Item}
            href={`/boards/board/${board?.id}`}
        >
            <Image
                src={board.coverImage ?? ''}
                alt='board image'
                width={0}
                height={0}
                sizes='100vw'
                className={styles.board__Img}
                style={{
                    objectFit: 'cover',
                }}
                priority
            />

            <h3 className={`${styles.title} ${notoSans.className}`}>{board.title}</h3>

            <div className={styles.members__Wrap}>
                {
                    React.Children.toArray(board?.members?.slice(0, 3).map(member => {
                        return <>
                            <ProfilePhotoItem
                                userImage={member?.user?.profilePhoto ?? member?.user?.image ?? ''}
                                profileLink={`/profile/${member.userId}`}
                                width='1.75rem'
                                height='1.75rem'
                                borderRadius='12px'
                            />
                        </>
                    }))
                }
                {
                    board?.members && board?.members?.length > 3 &&
                    <>
                        <p className={`${notoSans.className} ${styles.other__Members}`}>+ {board?.members?.slice(3)?.length} others</p>
                    </>
                }
            </div>
        </Link>
    )
}

export default BoardCard