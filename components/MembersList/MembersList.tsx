import React from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import CustomButton from '@components/CustomButton/CustomButton'
import { notoSans } from '@app/layout'


const MembersList = ({
    members,
    listOwnerId,
    isListOwner = false,
    showMemberActions = false,
    handleRemoveMember = (memberId: string) => { },
    showMemberName = true,
    className,
    maxNumberToDisplay = null,
    memberIdsBeingRemoved = [],
}: {
    members: BoardMemberType[] | CardMemberType[],
    listOwnerId?: string,
    isListOwner?: boolean,
    showMemberActions?: boolean,
    handleRemoveMember?: (memberId: string) => void,
    showMemberName?: boolean,
    className?: string,
    maxNumberToDisplay?: number | null,
    memberIdsBeingRemoved?: string[],
}) => {
    return <section className={`${styles.members} ${className ?? ''}`}>
        {
            React.Children.toArray(members?.slice(0, maxNumberToDisplay ?? members?.length)?.map(member => {
                const memberIsBeingRemoved = memberIdsBeingRemoved.includes(member.userId);
                
                return <section className={styles.member__Item}>
                    <section className={styles.member__Item__Detail}>
                        <Image
                            src={member?.user?.profilePhoto ?? member?.user?.image ?? ''}
                            alt='member image'
                            width={0}
                            height={0}
                            sizes='100vw'
                            className={styles.creator__Img}
                            style={{
                                objectFit: 'cover',
                            }}
                        />

                        {
                            showMemberName ? <p>
                                {member?.user?.name}
                            </p> :
                                <></>
                        }
                    </section>

                    {
                        listOwnerId === member?.userId ? <>
                            <p className={styles.admin}>Admin</p>
                        </> :
                            showMemberActions && isListOwner ?
                                <>
                                    <CustomButton
                                        title={memberIsBeingRemoved ? 'Removing...' : 'Remove'}
                                        border='1px solid #EB5757'
                                        color='#EB5757'
                                        fontSize='0.625rem'
                                        fontWeight='500'
                                        backgroundColor='transparent'
                                        handleClick={() => handleRemoveMember(member.userId)}
                                        disabled={memberIsBeingRemoved}
                                    />
                                </>
                                :
                                <></>
                    }
                </section>
            }))
        }

        {
            maxNumberToDisplay && members?.length > maxNumberToDisplay &&
            <>
                <p className={`${notoSans.className} ${styles.other__Members}`}>+ {members?.slice(maxNumberToDisplay)?.length} others</p>
            </>
        }
    </section>
}

export default MembersList;