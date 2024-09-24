import styles from './styles.module.css'
import React from 'react'
import { notoSans } from '@app/layout'
import { visibilityOptions } from './utils'
import CustomButton from '@components/CustomButton/CustomButton'
import { appColors } from '@utils/colors'

const BoardVisibilitySelector = ({
    className,
    selectedVisibility,
    handleSelectVisibilty = (option: string) => { },
    showActionBtns = false,
    handleCancelBtnClick = () => { },
    handleSaveBtnClick = () => { },
    loading = false,
}: {
    className?: string,
    selectedVisibility?: string,
    handleSelectVisibilty?: (option: string) => void,
    showActionBtns?: boolean,
    handleCancelBtnClick?: () => void,
    handleSaveBtnClick?: () => void,
    loading?: boolean,
}) => {

    return (
        <div className={`${styles.selector__Wrap} ${className}`}>
            <h4 className={styles.title}>
                <span>Visibility</span>
                <span className={`${styles.subtitle} ${notoSans.className}`}>Choose who can see this board.</span>
            </h4>

            {
                React.Children.toArray(visibilityOptions.map(option => {
                    return <section
                        className={`${styles.visibility__Choice} ${selectedVisibility === option.value ? styles.active : ''}`}
                        onClick={() => handleSelectVisibilty(option.value)}
                    >
                        <section className={styles.top__Visibility__Section}>
                            <option.icon />
                            <p className={notoSans.className}>{option.title}</p>
                        </section>
                        <p className={`${styles.visibility__Text} ${notoSans.className}`}>{option.info}</p>
                    </section>
                }))
            }

            {
                showActionBtns && <>
                    <br />
                    <section className={styles.visibility__Actions}>
                        <CustomButton
                            handleClick={handleCancelBtnClick}
                            title='Cancel'
                            color={appColors.primaryBlueColor}
                            backgroundColor='transparent'
                            disabled={loading}
                        />
                        <CustomButton
                            handleClick={handleSaveBtnClick}
                            title={loading ? 'Saving...' : 'Save'}
                            disabled={loading}
                        />
                    </section>
                </>
            }
        </div>
    )
}

export default BoardVisibilitySelector