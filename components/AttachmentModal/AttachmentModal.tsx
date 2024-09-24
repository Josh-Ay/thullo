import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { notoSans } from '@app/layout'
import LabelWithInput from '@components/LabelWithInput/LabelWithInput'
import CustomButton from '@components/CustomButton/CustomButton'
import { appColors } from '@utils/colors'
import { toast } from 'sonner'
import { convertFileObjectToBinaryStr } from '@utils/utils'
import { availableFileTypes, getFileSizeInUnit, initialDetails, maximumFileSizeDetails } from './utils'
import AttachmentPreview from '@components/AttachmentPreview/AttachmentPreview'
import { CardService } from '@services/cardService'
import { useAppContext } from '@contexts/AppContext'

const AttachmentModal = ({
    className,
    card,
    handleCloseModal = () => { },
}: {
    className?: string,
    card: CardType,
    handleCloseModal?: () => void,
}) => {
    const [attachmentDetails, setAttachmentDetails] = useState(initialDetails);
    const [loading, setLoading] = useState(false);

    const {
        allBoards,
        setCurrentBoardDetails,
        setAllBoards,
    } = useAppContext();

    const cardService = new CardService();

    useEffect(() => {
        setAttachmentDetails((prevDetail) => {
            return {
                ...prevDetail,
                filePreview: '',
                file: null,
            }
        });
    }, [attachmentDetails.fileType])

    const handleDetailUpdate = (name: string, val: string | File | null) => {
        setAttachmentDetails((prevDetail) => {
            return {
                ...prevDetail,
                [name]: val,
            }
        })
    }

    const handleFileInputChange = (targetName: string, targetValue: string | FileList | null) => {
        if (!targetValue || !targetValue[0]) return;

        const fileUploaded = targetValue[0] as File;

        const fileSizeInMB = getFileSizeInUnit(fileUploaded.size, maximumFileSizeDetails.unit);
        if (fileSizeInMB > maximumFileSizeDetails.size) return toast.info("File upload failed. Please try adding a file below 1MB instead");

        handleDetailUpdate('file', fileUploaded);
        handleDetailUpdate('fileExtension', fileUploaded.name.split(".")[1]);

        convertFileObjectToBinaryStr(fileUploaded).then(res => {
            handleDetailUpdate('filePreview', res as string);
        }).catch(() => { })
    }

    const handleSubmitDetails = async () => {
        if (loading) return;
        if (attachmentDetails.name.length < 1) return toast.info("Please enter a name for this attachment");
        if (attachmentDetails.fileType.length < 1) return toast.info("Please select a file type for this attachment");
        if (!attachmentDetails.file) return toast.info("Please attach a file");

        const newAttachmentData = {
            name: attachmentDetails.name,
            attachmentFile: attachmentDetails.filePreview,
            fileExtension: attachmentDetails.fileExtension,
            fileType: attachmentDetails.fileType,
            cardId: card.id,
        };

        setLoading(true);

        try {
            const res = await cardService.addNewCardAttachment(newAttachmentData);

            setLoading(false);
            setAttachmentDetails(initialDetails);

            const copyOfAllBoards: BoardType[] = allBoards.slice();

            const currentBoard = copyOfAllBoards?.find(item => item.lists.find(list => list.id === card.listId));
            if (!currentBoard) return handleCloseModal();

            const foundCardListing = currentBoard?.lists?.find(item => item.id === card.listId);
            if (!foundCardListing) return handleCloseModal();

            const cardFound = foundCardListing.cards.find(item => item.id === card.id);
            if (!cardFound) return handleCloseModal();

            const currentCardAttachments = cardFound.attachments?.slice() ?? [];
            currentCardAttachments?.unshift(res);

            cardFound.attachments = currentCardAttachments;
            cardFound.totalAttachments += 1;

            setCurrentBoardDetails(currentBoard);
            setAllBoards(copyOfAllBoards);

            handleCloseModal();
        } catch (error) {
            setLoading(false);
        }
    }

    return <section className={`${styles.modal__Wrap} ${className ?? ''}`}>
        <section>
            <h2 className={styles.title}>Attachments</h2>
            <p className={`${styles.subtitle} ${notoSans.className}`}>Add an attachment to this card</p>
        </section>

        <section className={styles.item__Wrap}>
            <p className={`${styles.item__Title} ${notoSans.className}`}>Name of Attachment</p>
            <LabelWithInput
                inputName='name'
                inputValue={attachmentDetails.name}
                handleInputChange={(name, val) => handleDetailUpdate(name, val as string)}
                className={styles.attachment__Title}
            />
        </section>

        <section className={styles.item__Wrap}>
            <p className={`${styles.item__Title} ${notoSans.className}`}>Attachment File Type</p>

            <section className={styles.file__Options__Wrap}>
                {
                    React.Children.toArray(availableFileTypes.map(type => {
                        return <CustomButton
                            title={type.title}
                            backgroundColor={
                                attachmentDetails.fileType === type.title ?
                                    appColors.primaryBlueColor
                                    :
                                    appColors.paleGreyColor
                            }
                            color={
                                attachmentDetails.fileType === type.title ?
                                    '#fff'
                                    :
                                    '#828282'
                            }
                            padding='0.3rem 1rem'
                            fontSize='0.55rem'
                            borderRadius='12px'
                            handleClick={() => handleDetailUpdate('fileType', type.title)}
                        />
                    }))
                }
            </section>
        </section>

        <section className={styles.item__Wrap}>
            <p className={`${styles.item__Title} ${notoSans.className}`}>
                <span>
                    {
                        attachmentDetails.file ?
                            'File Preview'
                            :
                            `Select File (maximum of ${maximumFileSizeDetails.size}${maximumFileSizeDetails.unit})`
                    }
                </span>
                {
                    attachmentDetails.file ? <CustomButton
                        title='Remove'
                        backgroundColor='transparent'
                        className={notoSans.className}
                        color={appColors.primaryBlueColor}
                        fontSize='0.65rem'
                        fontWeight='500'
                        padding='0'
                        handleClick={() => {
                            setAttachmentDetails((prevDetail) => {
                                return {
                                    ...prevDetail,
                                    filePreview: '',
                                    file: null,
                                }
                            });
                        }}
                    /> :
                        <></>
                }
            </p>

            {
                attachmentDetails.file ? <>
                    <AttachmentPreview
                        fileType={attachmentDetails.fileType}
                        fileSrc={attachmentDetails.filePreview}
                        fileName={attachmentDetails.name}
                    />
                </> : <>
                    <LabelWithInput
                        inputType='file'
                        accept={availableFileTypes.find(item => item.title === attachmentDetails.fileType)?.fileExtension}
                        handleInputChange={handleFileInputChange}
                        disabled={attachmentDetails.fileType.length < 1}
                    />
                </>
            }
        </section>

        <CustomButton
            title={loading ? 'Adding' : 'Add'}
            width='max-content'
            margin='0 auto'
            handleClick={handleSubmitDetails}
            disabled={loading}
        />
    </section>
}

export default AttachmentModal