import { AvailableAttachmentTypes, extractWordInitialsInString } from '@utils/utils'
import React from 'react'
import styles from './styles.module.css'
import Image from 'next/image'


const AttachmentPreview = ({
    fileType,
    fileSrc,
    fileName,
    className,
}: {
    fileType: string,
    fileSrc: string,
    fileName: string,
    className?: string
}) => {
    if (fileType === AvailableAttachmentTypes.imageFile) return <Image
        src={fileSrc}
        alt='file preview'
        width={0}
        height={0}
        sizes='100vw'
        className={`${styles.file__Preview} ${className ?? ''}`}
        style={{
            objectFit: 'cover',
        }}
    />

    return <div className={`${styles.file__Preview__2} ${className ?? ''}`}>
        {extractWordInitialsInString(fileName)}
    </div>
}

export default AttachmentPreview