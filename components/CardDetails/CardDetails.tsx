"use client";

import React, { useEffect, useRef, useState } from 'react'
import styles from './styles.module.css'
import { AiFillFileText, AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
import CustomButton from '@components/CustomButton/CustomButton';
import Image from 'next/image';
import { MdAccountCircle, MdEdit } from 'react-icons/md';
import { notoSans } from '@app/layout';
import { IoIosImage, IoMdPeople } from 'react-icons/io';
import { PiTagSimpleFill } from "react-icons/pi";
import { useAppContext } from '@contexts/AppContext';
import { CardService } from '@services/cardService';
import { initialModalOptions } from './utils';
import PhotoSearch from '@components/PhotoSearch/PhotoSearch';
import useClickOutside from '@hooks/useClickOutside';
import LabelAdd from '@components/LabelAdd/LabelAdd';
import CardCommentsWrap from '@components/CardCommentsWrap/CardCommentsWrap';
import CustomHr from '@components/CustomHr/CustomHr';
import SectionTitleWithIcon from '@components/SectionTitleWithIcon/SectionTitleWithIcon';
import MembersList from '@components/MembersList/MembersList';
import AttachmentModal from '@components/AttachmentModal/AttachmentModal';
import AttachmentDetailWrap from '@components/AttachmentDetailWrap/AttachmentDetailWrap';
import { useSession } from 'next-auth/react';
import InviteMemberWrap from '@components/InviteMemberWrap/InviteMemberWrap';
import { ValidInviteTypes } from '@lib/validators/user';
import Link from 'next/link';
import { unsplashSiteLink } from '@utils/utils';

interface CardCoverImageDetails {
    coverImage?: string;
    coverImageAuthor?: string;
    coverImageAuthorProfile?: string;
}

const CardDetails = ({
    card,
    handleCloseModal = () => { },
}: {
    card: CardType,
    handleCloseModal?: () => void,
}) => {
    const {
        allBoards,
        setAllBoards,
        currentBoardDetails,
        setCurrentBoardDetails,
    } = useAppContext();

    const { data: session } = useSession();

    const [cardDetailsCopy, setCardDetailsCopy] = useState<CardType | null>(null);
    const [editDescriptionModeActive, setEditDescriptionModeActive] = useState(false);
    const [foundListOfCard, setFoundListOfCard] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [modalOptions, setModalOptions] = useState(initialModalOptions);

    const cardService = new CardService();

    const photoSearchRef = useRef<HTMLDivElement>(null);
    const labelAddRef = useRef<HTMLDivElement>(null);
    const attachmentModalRef = useRef<HTMLDivElement>(null);
    const membersModalRef = useRef<HTMLDivElement>(null);

    const modalWrap = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCardDetailsCopy(card);

        const currentBoard = allBoards?.find(item => item.lists.find(list => list.id === card.listId));
        if (!currentBoard) return setFoundListOfCard('');

        const foundCardListing = currentBoard?.lists?.find(item => item.id === card.listId);
        if (!foundCardListing) return setFoundListOfCard('');

        setFoundListOfCard(foundCardListing.title);
    }, [card])

    useClickOutside({
        elemRef: modalWrap,
        handleClickOutside: () => handleCloseModal(),
    });

    useClickOutside({
        elemRef: photoSearchRef,
        handleClickOutside: () => handleUpdateModalOption('showCoverImageModal', false),
    });

    useClickOutside({
        elemRef: labelAddRef,
        handleClickOutside: () => handleUpdateModalOption('showLabelModal', false),
    });

    useClickOutside({
        elemRef: attachmentModalRef,
        handleClickOutside: () => handleUpdateModalOption('showAttachmentModal', false),
    });

    useClickOutside({
        elemRef: membersModalRef,
        handleClickOutside: () => handleUpdateModalOption('showMembersModal', false),
    });

    const handleUpdateModalOption = (option: string, value: boolean) => {
        setModalOptions(initialModalOptions);

        setModalOptions((prev) => {
            return {
                ...prev,
                [option]: value,
            }
        })
    }

    const handleSaveDetails = async (coverImageDetails: CardCoverImageDetails | null = null) => {
        setLoading(true);

        const copyOfAllBoards: BoardType[] = allBoards.slice();

        try {
            const res = await cardService.updateSingleCardDetails(
                card.id, 
                coverImageDetails ? {
                    title: cardDetailsCopy?.title,
                    description: cardDetailsCopy?.description ?? '',
                    listId: cardDetailsCopy?.listId,
                    ...coverImageDetails,
                } : {
                    title: cardDetailsCopy?.title,
                    description: cardDetailsCopy?.description ?? '',
                    listId: cardDetailsCopy?.listId,
                    coverImage: cardDetailsCopy?.coverImage ?? '',
                    coverImageAuthor: cardDetailsCopy?.coverImageAuthor ?? '',
                    coverImageAuthorProfile: cardDetailsCopy?.coverImageAuthorProfile ?? '',
                }
            );

            const currentBoard = copyOfAllBoards?.find(item => item.lists.find(list => list.id === card.listId));
            if (!currentBoard) return;

            const foundCardListing = currentBoard?.lists?.find(item => item.id === card.listId);
            if (!foundCardListing) return;

            const copyOfListCards = foundCardListing.cards.slice();

            const cardIndexInList = copyOfListCards.findIndex(item => item.id === card.id);
            if (cardIndexInList === -1) return;

            const currentCardDetails = copyOfListCards[cardIndexInList];
            copyOfListCards[cardIndexInList] = {
                ...currentCardDetails,
                ...res,
            };
            foundCardListing.cards = copyOfListCards;

            setCurrentBoardDetails(currentBoard);
            setAllBoards(copyOfAllBoards);

            setEditDescriptionModeActive(false);
            setLoading(false);

            setModalOptions(initialModalOptions);
        } catch (error) {
            setLoading(false);
        }
    }

    const handleCancelEdit = () => {
        setEditDescriptionModeActive(false);
        setCardDetailsCopy(card);
    }

    if (!cardDetailsCopy) return <></>

    return <>
        <section className={styles.card__Modal__Wrap}>
            <section
                className={styles.card__Modal}
                ref={modalWrap}
            >
                <CustomButton
                    icon={AiOutlineClose}
                    className={styles.close__Btn}
                    iconSize='1.5rem'
                    padding='0.3rem'
                    handleClick={() => handleCloseModal()}
                />

                <section className={styles.top__Details}>
                    {
                        (!cardDetailsCopy?.coverImage || (cardDetailsCopy?.coverImage && cardDetailsCopy?.coverImage?.length < 1)) ? <>
                            <section className={styles.no__Image__Content}>
                                <p>
                                    {
                                        loading ? 'Please wait...'
                                        :
                                        'No card image available'
                                    }
                                </p>
                            </section>
                        </> :
                            <>
                                <section className={styles.image__Wrap}>
                                    <Image
                                        src={cardDetailsCopy?.coverImage ?? ''}
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
                                    {
                                        cardDetailsCopy?.coverImageAuthor && cardDetailsCopy?.coverImageAuthorProfile &&
                                        <p className={styles.author__Details}>
                                            <span>
                                                Photo by <Link href={cardDetailsCopy?.coverImageAuthorProfile} target='_blank' rel='noreferrer noopener'>{cardDetailsCopy?.coverImageAuthor}</Link> on <Link href={unsplashSiteLink} target='_blank' rel='noreferrer noopener'>Unsplash</Link>
                                            </span>
                                        </p>
                                    }
                                </section>
                            </>
                    }
                </section>

                <section className={styles.details__Wrap}>
                    <section className={styles.card__Info__Wrap}>
                        <section className={styles.title__Wrap}>
                            <h3 className={`${notoSans.className} ${styles.title}`}>{cardDetailsCopy.title}</h3>
                            <p className={styles.subtitle}>In list: <span className={styles.list__Title}>{foundListOfCard}</span></p>

                            <CustomHr />
                        </section>

                        <section className={styles.card__Desc__Wrap}>
                            <section className={styles.description__Title__Wrap}>
                                <SectionTitleWithIcon
                                    title='Description'
                                    icon={AiFillFileText}
                                />

                                {
                                    editDescriptionModeActive ? <></>
                                        :
                                        (
                                            (!card.members?.find(item => item.userId === session?.user.id)) &&
                                                (card.creatorId !== session?.user.id) ? <></>
                                                :
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
                                                    handleClick={() => setEditDescriptionModeActive(true)}
                                                />
                                        )
                                }
                            </section>

                            {
                                editDescriptionModeActive ?
                                    <>
                                        <textarea
                                            className={`${notoSans.className} ${styles.description}`}
                                            rows={5}
                                            placeholder='Enter description here. Use *word* for bold text'
                                            value={cardDetailsCopy.description}
                                            onChange={({ target }) => setCardDetailsCopy((prevDetails) => {
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
                                                handleClick={() => handleSaveDetails()}
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
                                                __html: cardDetailsCopy?.description?.replace(/\*(.*?)\*/g, '<strong>$1</strong>') ?? ""
                                            }}
                                        >
                                        </p>
                                    </>
                            }
                        </section>

                        <section className={styles.description__Title__Wrap}>
                            <SectionTitleWithIcon
                                title='Attachments'
                                icon={AiFillFileText}
                            />

                            {
                                (!card.members?.find(item => item.userId === session?.user.id)) &&
                                    (card.creatorId !== session?.user.id) ? <></>
                                    :
                                    <CustomButton
                                        icon={AiOutlinePlus}
                                        title='Add'
                                        border='1px solid #BDBDBD'
                                        backgroundColor='transparent'
                                        borderRadius='8px'
                                        color='#828282'
                                        fontSize='0.625rem'
                                        iconSize='0.875rem'
                                        padding='0.238rem 0.63rem'
                                        className={styles.edit__Btn}
                                        gap='0.5rem'
                                        handleClick={() => handleUpdateModalOption('showAttachmentModal', true)}
                                    />
                            }

                            {
                                modalOptions.showAttachmentModal &&
                                <div ref={attachmentModalRef}>
                                    <AttachmentModal
                                        className={styles.attachment__Wrap}
                                        card={card}
                                        handleCloseModal={() => handleUpdateModalOption('showAttachmentModal', false)}
                                    />
                                </div>
                            }
                        </section>

                        <AttachmentDetailWrap card={card} />

                        <br />

                        <CardCommentsWrap card={card} />
                    </section>

                    <section className={styles.card__Actions__Wrap}>
                        {
                            (!card.members?.find(item => item.userId === session?.user.id)) &&
                                (card.creatorId !== session?.user.id) ?
                                <></>
                                :
                                <SectionTitleWithIcon
                                    title='Actions'
                                    icon={MdAccountCircle}
                                />
                        }

                        <section className={styles.card__Actions}>
                            {
                                (!card.members?.find(item => item.userId === session?.user.id)) &&
                                    (card.creatorId !== session?.user.id) ? <></>
                                    : <>
                                        <CustomButton
                                            icon={IoIosImage}
                                            iconSize='0.75rem'
                                            fontSize='0.75rem'
                                            backgroundColor='#F2F2F2'
                                            color='#828282'
                                            title='Cover'
                                            padding='0.75rem 1.4rem'
                                            gap='0.75rem'
                                            justifyContent='flex-start'
                                            handleClick={() => handleUpdateModalOption('showCoverImageModal', !modalOptions.showCoverImageModal)}
                                            disabled={loading}
                                        />

                                        <CustomButton
                                            icon={PiTagSimpleFill}
                                            iconSize='0.75rem'
                                            fontSize='0.75rem'
                                            backgroundColor='#F2F2F2'
                                            color='#828282'
                                            title='Labels'
                                            padding='0.75rem 1.4rem'
                                            gap='0.75rem'
                                            justifyContent='flex-start'
                                            handleClick={() => handleUpdateModalOption('showLabelModal', !modalOptions.showLabelModal)}
                                            disabled={loading}
                                        />
                                    </>
                            }

                            {
                                modalOptions.showCoverImageModal &&
                                <div ref={photoSearchRef}>
                                    <PhotoSearch
                                        className={styles.photo__Search__Wrap}
                                        handleSelectPhoto={(coverImage: string, coverImageAuthor: string, coverImageAuthorProfile: string) => {
                                            handleUpdateModalOption('showCoverModal', false);

                                            handleSaveDetails({
                                                coverImage,
                                                coverImageAuthor,
                                                coverImageAuthorProfile,
                                            });
                                        }}
                                        searchDisabled={loading}
                                    />
                                </div>
                            }

                            {
                                modalOptions.showLabelModal &&
                                <div ref={labelAddRef}>
                                    <LabelAdd
                                        className={styles.label__Add__Wrap}
                                        cardId={cardDetailsCopy.id}
                                        listId={cardDetailsCopy.listId}
                                        cardLabels={cardDetailsCopy?.labels ?? []}
                                    />
                                </div>
                            }
                        </section>

                        <br />
                        <SectionTitleWithIcon
                            title='Members'
                            icon={IoMdPeople}
                        />

                        <section className={styles.card__Members__Wrap}>
                            <MembersList
                                members={card.members ?? []}
                            />

                            {
                                (card.creatorId === session?.user.id || currentBoardDetails?.creatorId === session?.user.id) &&
                                <CustomButton
                                    title='Assign a member'
                                    icon={AiOutlinePlus}
                                    isTrailingIcon={true}
                                    backgroundColor='#DAE4FD'
                                    color='#2F80ED'
                                    iconSize='0.75rem'
                                    fontSize='0.7rem'
                                    gap='0.8rem'
                                    justifyContent='space-between'
                                    margin='0 auto 0 0'
                                    handleClick={() => handleUpdateModalOption('showMembersModal', true)}
                                />
                            }

                            {
                                modalOptions.showMembersModal &&
                                <>
                                    {
                                        !currentBoardDetails ? <></> :
                                            <div
                                                ref={membersModalRef}
                                            >
                                                <InviteMemberWrap
                                                    title='Member'
                                                    subtitle='Assign members to this card'
                                                    board={currentBoardDetails}
                                                    inviteType={ValidInviteTypes.cardInvite}
                                                    handleCloseModal={() => handleUpdateModalOption('showMembersModal', false)}
                                                    card={card}
                                                    className={styles.member__Assign}
                                                    excludedMemberId={[card.creatorId, currentBoardDetails.creatorId]}
                                                />
                                            </div>
                                    }
                                </>
                            }
                        </section>
                    </section>
                </section>
            </section>
        </section>
    </>
}

export default CardDetails