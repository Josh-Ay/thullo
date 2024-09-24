import React from 'react'
import styles from './styles.module.css'
import { IconType } from 'react-icons'


const SectionTitleWithIcon = ({
    icon,
    iconSize = '0.75rem',
    title,
}: {
    icon: IconType,
    iconSize?: string,
    title: string,
}) => {
    const Icon = icon;

    return <section className={styles.section__Title__Wrap}>
        <Icon
            size={iconSize}
        />
        <p>{title}</p>
    </section>
}

export default SectionTitleWithIcon