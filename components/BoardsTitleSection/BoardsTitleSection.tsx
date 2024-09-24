"use client";

import React, { useState } from 'react'
import styles from './styles.module.css'
import CustomButton from '@components/CustomButton/CustomButton'
import { IoAddOutline } from 'react-icons/io5';
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
import Image from 'next/image';
import LabelWithInput from '@components/LabelWithInput/LabelWithInput';
import { IoIosImage } from 'react-icons/io';
import { toast } from 'sonner';
import PhotoSearch from '@components/PhotoSearch/PhotoSearch';
import { useAppContext } from '@contexts/AppContext';
import { BoardService } from '@services/boardService';
import BoardVisibilitySelector from '@components/BoardVisibilitySelector/BoardVisibilitySelector';
import { visibilityOptions } from '@components/BoardVisibilitySelector/utils';
import Link from 'next/link';
import { unsplashSiteLink } from '@utils/utils';

const initialNewBoardDetails = {
    title: '',
    coverImage: '',
    coverImageAuthor: '',
    coverImageAuthorProfile: '',
    visibility: visibilityOptions[1].value,
    lists: [],
};

const BoardsTitleSection = ({
    title
}: {
    title: String,
}) => {
    const [newBoardDetails, setNewBoardDetails] = useState(initialNewBoardDetails);
    const [showNewBoardModal, setShowNewBoardModal] = useState(false);
    const [boardSettingOptions, setBoardSettingOptions] = useState({
        showCoverModal: false,
        showVisibilityModal: false,
    });
    const [dataLoading, setDataLoading] = useState(false);

    const {
        allBoards,
        setAllBoards,
    } = useAppContext();

    const boardService = new BoardService();

    const handleUpdateDetail = (name: string, val: string) => {
        setNewBoardDetails((prevDetails) => {
            return {
                ...prevDetails,
                [name]: val,
            }
        })
    }

    const handleUpdateBoardSetting = (name: string, val: boolean) => {
        setBoardSettingOptions((prevDetails) => {
            return {
                ...prevDetails,
                [name]: val,
            }
        })
    }

    const handleCreateNewBoard = async () => {
        if (newBoardDetails.title.length < 1) return toast.info("Please enter a title");
        if (dataLoading) return;

        setDataLoading(true);

        try {
            const newBoardData = await boardService.createNewBoard({
                title: newBoardDetails.title,
                coverImage: newBoardDetails.coverImage,
                visibility: newBoardDetails.visibility,
            });

            setDataLoading(false);

            const copyOfAllBoards: BoardType[] = allBoards.slice();
            copyOfAllBoards.unshift(newBoardData);
            setAllBoards(copyOfAllBoards);

            setNewBoardDetails(initialNewBoardDetails);
            setShowNewBoardModal(false);
        } catch (error) {
            // console.log(error);
            setDataLoading(false);
        }
    }

    return <>
        <section className={styles.title__WRap}>
            <h3>{title}</h3>

            <CustomButton
                title='Add'
                icon={IoAddOutline}
                iconSize='1rem'
                color='#fff'
                gap='0.4rem'
                padding='0.55rem 0.78rem'
                handleClick={() => setShowNewBoardModal(true)}
            />
        </section>

        {
            showNewBoardModal && <>
                <section className={styles.new__Board__Modal__Wrap}>
                    <section className={styles.new__Board__Modal}>
                        <CustomButton
                            icon={AiOutlineClose}
                            className={styles.close__Btn}
                            iconSize='1.5rem'
                            padding='0.3rem'
                            handleClick={() => setShowNewBoardModal(false)}
                        />

                        <section className={styles.top__Details}>
                            {
                                (!newBoardDetails?.coverImage || (newBoardDetails?.coverImage && newBoardDetails?.coverImage?.length < 1)) ? <>
                                    <section className={styles.no__Image__Content}>
                                        <p>
                                            {
                                                dataLoading ?
                                                    'Please wait...'
                                                :
                                                'No cover image selected'
                                            }</p>
                                    </section>
                                </> :
                                    <>
                                        <section className={styles.image__Wrap}>
                                            <Image
                                                src={newBoardDetails.coverImage ?? ''}
                                                alt='board image'
                                                width={0}
                                                height={0}
                                                sizes='100vw'
                                                className={styles.board__Img}
                                                priority
                                                style={{
                                                    objectFit: 'cover',
                                                }}
                                            />
                                            {
                                                newBoardDetails.coverImageAuthor.length > 1 && newBoardDetails.coverImageAuthorProfile.length > 1 &&
                                                <p className={styles.author__Details}>
                                                    <span>
                                                        Photo by <Link href={newBoardDetails.coverImageAuthorProfile} target='_blank' rel='noreferrer noopener'>{newBoardDetails.coverImageAuthor}</Link> on <Link href={unsplashSiteLink} target='_blank' rel='noreferrer noopener'>Unsplash</Link>
                                                    </span>
                                                </p>
                                            }
                                        </section>
                                    </>
                            }

                            <LabelWithInput
                                inputPlaceholder='Add board title'
                                boxShadow='0px 4px 12px 0px #0000001A'
                                inputValue={newBoardDetails.title}
                                inputName='title'
                                handleInputChange={(name, val) => handleUpdateDetail(name, val as string)}
                            />
                        </section>

                        <section className={styles.board__Setting__Row}>
                            <CustomButton
                                icon={IoIosImage}
                                iconSize='0.9rem'
                                fontSize='0.8rem'
                                backgroundColor='#F2F2F2'
                                color='#828282'
                                title='Cover'
                                padding='0.75rem 1rem'
                                gap='0.75rem'
                                width='100%'
                                handleClick={() => {
                                    handleUpdateBoardSetting('showVisibilityModal', false);
                                    handleUpdateBoardSetting('showCoverModal', !boardSettingOptions.showCoverModal);
                                }}
                                disabled={dataLoading}
                            />

                            <CustomButton
                                icon={
                                    visibilityOptions.find(item => item.value === newBoardDetails.visibility)?.icon
                                }
                                backgroundColor='#F2F2F2'
                                color='#828282'
                                title={
                                    visibilityOptions.find(item => item.value === newBoardDetails?.visibility)?.title
                                }
                                iconSize='0.9rem'
                                fontSize='0.8rem'
                                padding='0.75rem 1rem'
                                gap='0.75rem'
                                width='100%'
                                handleClick={() => {
                                    handleUpdateBoardSetting('showVisibilityModal', !boardSettingOptions.showVisibilityModal);
                                    handleUpdateBoardSetting('showCoverModal', false);
                                }}
                                disabled={dataLoading}
                            />

                            {
                                boardSettingOptions.showCoverModal &&
                                <PhotoSearch
                                    className={styles.photo__Search__Wrap}
                                    handleSelectPhoto={(photoSelected: string, authorName: string, authorProfile: string) => {
                                        handleUpdateDetail('coverImage', photoSelected);
                                        handleUpdateDetail('coverImageAuthor', authorName);
                                        handleUpdateDetail('coverImageAuthorProfile', authorProfile);

                                        handleUpdateBoardSetting('showCoverModal', false);
                                    }}
                                />
                            }

                            {
                                boardSettingOptions.showVisibilityModal &&
                                <BoardVisibilitySelector
                                    className={styles.board__Visibility__Selector}
                                    selectedVisibility={newBoardDetails.visibility}
                                    handleSelectVisibilty={(visibilitySelected: string) => {
                                        handleUpdateDetail('visibility', visibilitySelected);
                                        handleUpdateBoardSetting('showVisibilityModal', false);
                                    }}
                                />
                            }
                        </section>

                        <section className={`${styles.board__Setting__Row} ${styles.bottom}`}>
                            <CustomButton
                                backgroundColor='transparent'
                                color='#828282'
                                title='Cancel'
                                fontSize='0.75rem'
                                padding='0.75rem 1rem'
                                gap='0.75rem'
                                width='100%'
                                disabled={dataLoading}
                                handleClick={() => setShowNewBoardModal(false)}
                            />
                            <CustomButton
                                icon={AiOutlinePlus}
                                title={dataLoading ? 'Creating...' : 'Create'}
                                iconSize='0.8rem'
                                fontSize='0.75rem'
                                padding='0.75rem 1rem'
                                gap='0.75rem'
                                width='100%'
                                handleClick={handleCreateNewBoard}
                                disabled={dataLoading}
                            />
                        </section>
                    </section>
                </section>
            </>
        }
    </>
}

export default BoardsTitleSection