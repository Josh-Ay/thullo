import React from 'react'
import styles from './styles.module.css'


const Spinner = ({
    color,
    size,
    borderWidth,
}: {
    color?: string,
    size?: string,
    borderWidth?: string,

}) => {
    return (
        <div
            className={styles.loader}
            style={{
                borderRightColor: color,
                width: size,
                borderWidth,
            }}
        ></div>
    )
}

export default Spinner