"use client";

import React, { useEffect, useRef, useState } from 'react'
import styles from './styles.module.css'
import SearchBar from '@components/SearchBar/SearchBar'
import ProfileItem from '@components/ProfileItem/ProfileItem'
import Link from 'next/link'
import { IoIosMenu } from 'react-icons/io';
import CustomButton from '@components/CustomButton/CustomButton';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Spinner from '@components/Spinner/Spinner';
import { useAppContext } from '@contexts/AppContext';
import { CgLayoutGridSmall } from "react-icons/cg";
import { protectedRoutes, routesWithBoardHome } from './utils';
import { SearchService } from '@services/searchService';
import useClickOutside from '@hooks/useClickOutside';


const NavigationBar = () => {
    const { data: session, status } = useSession();
    const {
        currentBoardDetails,
        allBoardsLoaded,
    } = useAppContext();

    const [searchLoading, setSearchLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResultFormatType | null>(null);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const pathname = usePathname();
    const router = useRouter();

    const searchBarRef = useRef<HTMLDivElement>(null);
    const navActionRef = useRef<HTMLDivElement>(null);

    const searchService = new SearchService();

    useClickOutside({
        elemRef: searchBarRef,
        handleClickOutside: () => {
            setSearchResults(null);
            setSearchValue('');
        },
    });

    useClickOutside({
        elemRef: navActionRef,
        handleClickOutside: () => setShowMobileMenu(false),
    });

    useEffect(() => {
        if (status === 'loading') return;

        if (status === 'unauthenticated' && protectedRoutes.includes(pathname)) router.push('/auth/login');

        if (status === 'authenticated' && pathname === '/auth/login') router.push('/boards/all');
    }, [status, pathname, session])

    useEffect(() => {
        setSearchResults(null);
        setSearchValue('');
    }, [pathname])

    useEffect(() => {
        setSearchResults(null);

        if (searchValue.length < 1) return setSearchLoading(false);

        setSearchLoading(true);

        const timeout = setTimeout(() => {
            searchService.searchApp(searchValue).then(res => {
                setSearchLoading(false);
                setSearchResults(res);
            }).catch(() => {
                setSearchLoading(false);
            })
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchValue])

    return (
        <nav className={styles.nav__Bar}>
            <section className={styles.nav__Info}>
                <Link
                    href={
                        routesWithBoardHome.find(path => path.includes(pathname) || pathname.includes(path)) && session && session.user ?
                            '/boards/all'
                            :
                            '/'
                    }
                >
                    <picture>
                        <source media="(max-width:767px)" srcSet="/Logo-small.svg"></source>

                        <img
                            src="/Logo.svg"
                            alt="thullo logo"
                            className={styles.logo}
                        />
                    </picture>
                </Link>

                <section className={styles.board__Detail__Wrap}>
                    {
                        pathname.includes('/boards/board/') ?
                            !currentBoardDetails ? <></>
                                :
                                <>
                                    <h3 className={styles.board__Title}>{currentBoardDetails?.title}</h3>

                                    {
                                        session && session?.user && session?.user.id && <>
                                            <div className={styles.divider}></div>

                                            <CustomButton
                                                title='All boards'
                                                icon={CgLayoutGridSmall}
                                                iconSize='1rem'
                                                backgroundColor='#F2F2F2'
                                                color='#828282'
                                                justifyContent='center'
                                                gap='0.875rem'
                                                useLink={true}
                                                linkLocation='/boards/all'
                                            />
                                        </>
                                    }
                                </>
                            :
                            <></>
                    }
                </section>
            </section>

            <IoIosMenu
                fontSize={'1.5rem'}
                cursor={'pointer'}
                className={styles.mobile__Menu}
                onClick={() => setShowMobileMenu(true)}
            />

            <section 
                className={`${styles.nav__Actions__Wrap} ${showMobileMenu ? styles.mobile__Nav : ''}`}
                ref={navActionRef}
            >
                {
                    status === 'loading' ? <>
                        <Spinner
                            size='1.8rem'
                        />
                    </>
                        :
                        !session ? <>
                            <CustomButton
                                title='Log in'
                                padding='0.75rem 1.5rem'
                                fontSize='0.75rem'
                                useLink={true}
                                linkLocation={'/auth/login'}
                            />
                        </>
                            :
                            <>
                                <div ref={searchBarRef}>
                                    <SearchBar
                                        searchBtnText={'Search'}
                                        searchVal={searchValue}
                                        handleUpdateSearchValue={(name, val) => setSearchValue(val)}
                                        loading={searchLoading}
                                        results={searchResults}
                                        showResultsWrap={true}
                                        inputDisabled={!allBoardsLoaded}
                                    />
                                </div>

                                <ProfileItem />
                            </>
                }
            </section>
        </nav>
    )
}

export default NavigationBar;