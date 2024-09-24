import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import styles from './styles.module.css'


const ProfilePhotoItem = ({
    userImage,
    profileLink,
    width,
    height,
    borderRadius,
}: {
    userImage?: string,
    profileLink: string,
    width?: string,
    height?: string,
    borderRadius?: string,
}) => {
    if (!userImage) return <></>

    return (
        <Link
            href={profileLink}
            className={styles.profile__Item}
            style={{
                width,
                height,
            }}
        >
            <Image
                src={userImage}
                alt='user image'
                width={0}
                height={0}
                sizes='100vw'
                className={styles.user__Img}
                style={{
                    objectFit: 'cover',
                    borderRadius,
                }}
            />
        </Link>
    )
}

export default ProfilePhotoItem