"use client";

import React, { useRef, useState } from 'react'
import styles from './styles.module.css'
import CustomButton from '@components/CustomButton/CustomButton'
import { IoAdd } from 'react-icons/io5'
import { IoIosAttach } from 'react-icons/io'
import { notoSans } from '@app/layout'
import { BsChatLeftText } from "react-icons/bs"
import { CSS } from "@dnd-kit/utilities"
import { useSortable } from '@dnd-kit/sortable'
import { ItemDragTypes } from '@components/BoardCanvas/utils'
import CardDetails from '@components/CardDetails/CardDetails';
import Image from 'next/image';
import CardLabelWrap from '@components/LabelAdd/components/CardLabelWrap';
import { useSession } from 'next-auth/react';
import { useAppContext } from '@contexts/AppContext';
import MembersList from '@components/MembersList/MembersList';
import InviteMemberWrap from '@components/InviteMemberWrap/InviteMemberWrap';
import { ValidInviteTypes } from '@lib/validators/user';
import useClickOutside from '@hooks/useClickOutside';

const ListCard = ({
    card,
}: {
    card: CardType,
}) => {
    const { data: session } = useSession();

    const {
        currentBoardDetails,
    } = useAppContext();

    const [showCardDetails, setShowCardDetails] = useState<boolean>(false);
    const [showMemberInviteModal, setShowMemberInviteModal] = useState<boolean>(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useSortable({
        id: card.id,
        data: {
            type: ItemDragTypes.Card,
            item: card,
        },
        disabled: (!session || !session.user) ? true : false,
    });

    const membersModalRef = useRef<HTMLDivElement>(null);

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    useClickOutside({
        elemRef: membersModalRef,
        handleClickOutside: () => setShowMemberInviteModal(false),
    })

    if (isDragging) return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`${styles.list__card} ${styles.card__Dragging}`}
            id={card.id}
        ></div>
    );

    return <>
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={styles.list__card}
            id={card.id}
            onClick={(event) => {
                event.stopPropagation();

                setShowCardDetails(true)
            }}
        >
            {
                card.coverImage && card.coverImage?.length > 0 ?
                    <Image
                        src={card.coverImage}
                        alt='card image'
                        width={0}
                        height={0}
                        sizes='100vw'
                        className={styles.card__Img}
                        priority
                        style={{
                            objectFit: 'cover',
                        }}
                    />
                    :
                    <></>
            }
            <h4 className={`${styles.title} ${notoSans.className}`}>{card.title}</h4>

            <CardLabelWrap
                labels={card.labels ?? []}
            />

            <section className={styles.bottom__Section}>
                <section className={styles.bottom__Section__Item}>
                    <MembersList
                        members={card.members ?? []}
                        showMemberName={false}
                        className={styles.members}
                        maxNumberToDisplay={2}
                    />

                    {
                        ((session?.user.id === currentBoardDetails?.creatorId) || (card.creatorId === session?.user.id)) &&
                        <div 
                            className={styles.add__Member__Wrap}
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                        >
                            <CustomButton
                                icon={IoAdd}
                                iconSize='1.5rem'
                                padding='0.15rem'
                                handleClick={() => {
                                    setShowMemberInviteModal(true);
                                }}
                            />

                            {
                                showMemberInviteModal &&
                                <div
                                    ref={membersModalRef}
                                >
                                    {
                                        !currentBoardDetails ? <></> : <>
                                            <InviteMemberWrap
                                                title='Member'
                                                subtitle='Assign members to this card'
                                                board={currentBoardDetails}
                                                inviteType={ValidInviteTypes.cardInvite}
                                                handleCloseModal={() => setShowMemberInviteModal(false)}
                                                card={card}
                                                className={styles.member__Assign}
                                                excludedMemberId={[card.creatorId, currentBoardDetails.creatorId]}
                                            />
                                        </>
                                    }
                                </div>
                            }
                        </div>
                    }
                </section>

                <section className={styles.bottom__Section__Item}>
                    <div className={styles.card__Stat}>
                        <BsChatLeftText />
                        <p className={notoSans.className}>{card.totalComments}</p>
                    </div>

                    <div className={styles.card__Stat}>
                        <IoIosAttach />
                        <p className={notoSans.className}>{card.totalAttachments}</p>
                    </div>
                </section>
            </section>
        </div>

        {
            showCardDetails &&
            <CardDetails
                card={card}
                handleCloseModal={() => setShowCardDetails(false)}
            />
        }
    </>
}

export default ListCard