import CustomButton from '@components/CustomButton/CustomButton'
import React, { useRef } from 'react'
import styles from './styles.module.css'
import { notoSans } from '@app/layout'
import { IoAdd } from 'react-icons/io5'
import { appColors } from '@utils/colors'
import useClickOutside from '@hooks/useClickOutside'


const NewCanvasItem = ({
    inputName = '',
    inputValue = '',
    placeholder = 'Enter here',
    handleUpdateDetail = () => { },
    handleAddNewCanvasItem = () => { },
    handleToggleModal = () => { },
    loading = false,
    showAddNewModal = false,
    itemType = '',
    isDragging = false,
    showAddNewBtn = true,
}: {
    inputName?: string,
    inputValue?: string,
    placeholder?: string,
    itemType?: string,
    handleUpdateDetail?: (name: string, val: string) => void,
    handleAddNewCanvasItem?: () => void,
    handleToggleModal?: (val: boolean) => void,
    loading?: boolean,
    showAddNewModal?: boolean,
    isDragging?: boolean,
    showAddNewBtn?: boolean,
}) => {
    const inputRef = useRef<HTMLDivElement>(null);

    useClickOutside({
        elemRef: inputRef,
        handleClickOutside: () => handleToggleModal(false),
    });

    return (
        <section className={styles.add__New__Item__Col}>
            {
                showAddNewModal &&
                <section
                    className={styles.new__Canvas__Item}
                    ref={inputRef}
                >
                    <textarea
                        name={inputName}
                        value={inputValue}
                        placeholder={placeholder}
                        onChange={({ target }) => handleUpdateDetail(target.name, target.value)}
                        className={notoSans.className}
                    />

                    <CustomButton
                        title={loading ? 'Saving...' : 'Save'}
                        backgroundColor='#219653'
                        handleClick={handleAddNewCanvasItem}
                        width='max-content'
                        disabled={loading}
                    />
                </section>
            }

            {
                (!showAddNewBtn || isDragging) ? <></> :
                    <CustomButton
                        title={
                            isDragging ? ``
                                :
                                `Add another ${itemType}`
                        }
                        icon={
                            isDragging ?
                                () => <></>
                                :
                                IoAdd
                        }
                        backgroundColor={appColors.paleBlueBgColor2}
                        color={appColors.primaryBlueColor}
                        className={notoSans.className}
                        isTrailingIcon={true}
                        iconSize='1rem'
                        padding='0.7rem 0'
                        handleClick={() => handleToggleModal(!showAddNewModal)}
                        width='15.5rem'
                        disabled={loading}
                    />
            }
        </section>
    )
}

export default NewCanvasItem