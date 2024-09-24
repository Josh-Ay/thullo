import React from 'react'
import styles from '../styles.module.css'
import { notoSans } from '@app/layout'
import { hexToRgbWithOpacity } from '../utils'


const CardLabelWrap = ({
    labels,
}: {
    labels: CardLabelType[],
}) => {
    return <section className={styles.labels__Wrap}>
        {
            React.Children.toArray(labels?.map(label => {
                return <p
                    className={`${styles.label} ${notoSans.className}`}
                    style={{
                        backgroundColor: `${hexToRgbWithOpacity(label.color, 0.15)}`,
                        color: label.color,
                    }}
                >
                    <span>
                        {label.name}
                    </span>
                </p>
            }))
        }
    </section>
}

export default CardLabelWrap