import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import SearchBar from '@components/SearchBar/SearchBar'
import { notoSans } from '@app/layout';
import { IoIosSearch } from 'react-icons/io';
import CustomButton from '@components/CustomButton/CustomButton';
import { UserService } from '@services/userService';
import Spinner from '@components/Spinner/Spinner';
import Image from 'next/image';
import { AiOutlineCheck } from 'react-icons/ai';


const InviteMemberWrap = ({
    title = '',
    subtitle = 'Search users you want to invite',
    className,
    inviteType,
    board,
    card,
    handleCloseModal = () => { },
    excludedMemberId,
}: {
    title: string,
    subtitle?: string,
    className?: string,
    inviteType: string,
    board: BoardType,
    card?: CardType,
    handleCloseModal?: () => void,
    excludedMemberId?: string[],
}) => {
    const [userSearchValue, setUserSearchValue] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<UserSearchType[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<UserSearchType[]>([]);

    const userService = new UserService();

    useEffect(() => {
        if (userSearchValue.length < 1) {
            setSearchResults([]);
            setSelectedUsers([]);
            return;
        }

        const timeout = setTimeout(() => {
            setSearchLoading(true);
            setSelectedUsers([]);

            userService.searchUser(userSearchValue).then(res => {
                setSearchResults(res);
                setSearchLoading(false);
            }).catch(err => {
                setSearchLoading(false);
            });
        }, 600);

        return () => clearTimeout(timeout);
    }, [userSearchValue])


    const handleSelectUser = (user: UserSearchType) => {
        const currentSelectedUsers: UserSearchType[] = selectedUsers.slice();

        if (currentSelectedUsers.find(item => user.email === item.email)) {
            return setSelectedUsers(currentSelectedUsers.filter(item => item.email !== user.email));
        }

        const { id, ...otherUserDetail } = user;

        currentSelectedUsers.push(otherUserDetail);
        setSelectedUsers(currentSelectedUsers);
    }

    const handleInviteMembers = async () => {
        if (loading || selectedUsers.length < 1) return;

        setLoading(true);

        try {
            await userService.sendInvite(inviteType, {
                boardId: board.id,
                cardId: card?.id,
                users: selectedUsers,
            });
            setLoading(false);
            handleCloseModal();
        } catch (error) {
            setLoading(false);
        }
    }

    return <section className={`${styles.member__WRap} ${className ?? ''}`}>
        <section>
            <h2 className={styles.title}>{title}</h2>
            <p className={`${styles.subtitle} ${notoSans.className}`}>{subtitle}</p>
        </section>

        <SearchBar
            searchVal={userSearchValue}
            handleUpdateSearchValue={(name, val) => setUserSearchValue(val)}
            minWidth='unset'
            inputDisabled={searchLoading}
            searchBtnIcon={IoIosSearch}
            placeholder='User...'
            searchBtnIconSize='1rem'
            searchBtnPadding='0.5rem 0.75rem'
        />

        <section className={styles.search__Wrap}>
            {
                searchLoading ? <div style={{
                    margin: '0 auto'
                }}>
                    <Spinner
                        size='1.2rem'
                        borderWidth='4px'
                    />
                </div> : <>
                    {
                        searchResults?.length < 1 ? <Image
                            src={'/search.svg'}
                            alt='empty result illustration'
                            width={0}
                            height={0}
                            sizes='100vw'
                            className={styles.illus__img}
                            style={{
                                objectFit: 'cover',
                            }}
                        /> : <>
                            {
                                React.Children.toArray(searchResults.map(item => {
                                    if (item.id && excludedMemberId?.includes(item?.id)) return <></>

                                    return <section
                                        className={styles.member__Item}
                                        onClick={
                                            loading ?
                                                () => { }
                                                :
                                                () => handleSelectUser(item)
                                        }
                                    >
                                        {
                                            selectedUsers.find(user => user.email === item.email) ? <section className={styles.user__Select}>
                                                <AiOutlineCheck
                                                    color='#fff'
                                                />
                                            </section> : <Image
                                                src={item.profilePhoto}
                                                alt='user image'
                                                width={0}
                                                height={0}
                                                sizes='100vw'
                                                className={styles.member__Img}
                                                style={{
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        }

                                        <p>{item.name}</p>
                                    </section>
                                }))
                            }
                        </>
                    }
                </>
            }
        </section>

        <CustomButton
            title={loading ? 'Inviting...' : 'Invite'}
            width='max-content'
            margin='0 auto'
            disabled={loading}
            handleClick={handleInviteMembers}
        />
    </section>
}

export default InviteMemberWrap;