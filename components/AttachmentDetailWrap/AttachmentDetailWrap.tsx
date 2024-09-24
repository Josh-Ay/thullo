import AttachmentPreview from '@components/AttachmentPreview/AttachmentPreview'
import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { formatDateAndTimeForApp } from '@utils/utils'
import CustomButton from '@components/CustomButton/CustomButton'
import { useSession } from 'next-auth/react'
import { CardService } from '@services/cardService'
import { useAppContext } from '@contexts/AppContext'
import Spinner from '@components/Spinner/Spinner'


const AttachmentDetailWrap = ({
    card,
}: {
    card: CardType
}) => {
    const { data: session } = useSession();

    const [attachmentsLoaded, setAttachmentsLoaded] = useState<boolean>(false);
    const [attachmentsLoading, setAttachmentsLoading] = useState<boolean>(true);
    const [attachmentsBeingDeleted, setAttachmentsBeingDeleted] = useState<string[]>([]);

    const {
        setCurrentBoardDetails,
        allBoards,
        setAllBoards,
    } = useAppContext();

    const cardService = new CardService();

    useEffect(() => {
        if (attachmentsLoaded) return setAttachmentsLoading(false);

        setAttachmentsLoading(true);
        setAttachmentsLoaded(false);

        cardService.getAllCardAttachments(card.id).then(res => {
            setAttachmentsLoading(false);
            setAttachmentsLoaded(true);

            updateCardAttachments({
                allAttachments: res,
                updateAll: true,
            });

        }).catch((err) => {
            setAttachmentsLoading(false);
        })
    }, [])

    const updateCardAttachments = ({
        updateAll = false,
        allAttachments = [],
        removeExisting = false,
        idToRemove = null,
    }: {
        updateAll?: boolean,
        allAttachments?: AttachmentType[],
        removeExisting?: boolean,
        idToRemove?: string | null,
    }) => {
        const copyOfAllBoards: BoardType[] = allBoards.slice();

        const currentBoard = copyOfAllBoards?.find(item => item.lists.find(list => list.id === card.listId));
        if (!currentBoard) return;

        const foundCardListing = currentBoard?.lists?.find(item => item.id === card.listId);
        if (!foundCardListing) return;

        const cardFound = foundCardListing.cards.find(item => item.id === card.id);
        if (!cardFound) return;

        if (updateAll === true) {
            cardFound.attachments = allAttachments;
            cardFound.totalAttachments = allAttachments.length;
        }

        if (removeExisting === true && idToRemove) {
            const copyOfCurrentAttachments = cardFound.attachments?.slice();
            
            cardFound.attachments = copyOfCurrentAttachments?.filter(item => item.id !== idToRemove);
            cardFound.totalAttachments -= 1;
        }

        setCurrentBoardDetails(currentBoard);
        setAllBoards(copyOfAllBoards);
    }

    const handleDownloadAttachment = (attachment: AttachmentType) => {
        const byteString = atob(attachment.attachmentFile.split(',')[1]);
        const mimeString = attachment.attachmentFile.split(',')[0].split(':')[1].split(';')[0];

        const byteNumbers = new Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            byteNumbers[i] = byteString.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeString });

        const link = document.createElement('a');

        link.href = URL.createObjectURL(blob);
        link.download = `${attachment.name}.${attachment.fileExtension}`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(link.href);
    }

    const handleDeleteAttachment = async (attachment: AttachmentType) => {
        const currentAttachmentsBeingDeleted = attachmentsBeingDeleted.slice();
        if (currentAttachmentsBeingDeleted.includes(attachment.id)) return;

        setAttachmentsBeingDeleted([...currentAttachmentsBeingDeleted, attachment.id]);

        try {
            await cardService.deleteCardAttachment(attachment.id, { cardId: attachment.cardId });
            updateCardAttachments({ removeExisting: true, idToRemove: attachment.id });

            setAttachmentsBeingDeleted(currentAttachmentsBeingDeleted);
        } catch (error) {
            setAttachmentsBeingDeleted(currentAttachmentsBeingDeleted);
        }
    }

    if (attachmentsLoading) return <div style={{
        padding: '1rem',
        width: 'max-content',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        justifyContent: 'flex-start',
        alignItems: 'center'
    }}>
        <Spinner />
        <p style={{ fontSize: '0.625rem' }}>Loading attachments...</p>
    </div>

    return <section className={styles.attachment__Wrap}>
        {
            React.Children.toArray(card.attachments?.map(attachment => {
                return <section className={styles.attachment__Detail__Wrap}>
                    <AttachmentPreview
                        fileName={attachment.name}
                        fileType={attachment.fileType}
                        fileSrc={attachment.attachmentFile}
                        className={styles.attachment__Preview}
                    />

                    <section className={styles.attachment__Details}>
                        <section>
                            <p className={styles.add__Info}>Added {formatDateAndTimeForApp(attachment.createdAt)}</p>
                            <h4 className={styles.title}>{attachment.name}</h4>
                        </section>

                        <section className={styles.actions__Wrap}>
                            <CustomButton
                                border='1px solid #BDBDBD'
                                backgroundColor='transparent'
                                color='#828282'
                                title='Download'
                                handleClick={() => handleDownloadAttachment(attachment)}
                            />

                            {
                                attachment.creatorId === session?.user?.id &&
                                <CustomButton
                                    border='1px solid #BDBDBD'
                                    backgroundColor='transparent'
                                    color='#828282'
                                    title={attachmentsBeingDeleted.includes(attachment.id) ? 'Deleting...' : 'Delete'}
                                    handleClick={() => handleDeleteAttachment(attachment)}
                                    disabled={attachmentsBeingDeleted.includes(attachment.id)}
                                />
                            }
                        </section>
                    </section>
                </section>
            }))
        }
    </section>
}

export default AttachmentDetailWrap