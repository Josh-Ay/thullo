'use client'

import SearchBar from '@components/SearchBar/SearchBar'
import React, { useEffect, useState } from 'react'
import { IoIosSearch } from 'react-icons/io'
import styles from './styles.module.css'
import { notoSans } from '@app/layout'
import Image from 'next/image'
import { PhotoSearchService } from '@services/photoSearchService'
import Spinner from '@components/Spinner/Spinner'


interface UnsplashURLObject {
    raw: string;
    full: string;
    regular: string;
    small: string;
    small_s3: string;
    thumb: string;
}

interface UnsplashUserLinksDetail {
    html: string;
}

interface UnsplashUserObject {
    name: string;
    links: UnsplashUserLinksDetail;
}

interface UnsplashSearchResult {
    urls: UnsplashURLObject;
    user: UnsplashUserObject;
}


const PhotoSearch = ({
    className,
    handleSelectPhoto = () => { },
    searchDisabled = false,
}: {
    className?: string,
    handleSelectPhoto?: (photoUrl: string, authorName: string, authorProfile: string) => void,
    searchDisabled?: boolean,
}) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    const searchService = new PhotoSearchService();

    useEffect(() => {
        if (searchValue.length < 1) return;

        const fetchImages = setTimeout(() => {
            setSearchLoading(true);

            searchService.searchImageOnUnsplash(searchValue).then(res => {
                setSearchResults(res ?? []);
                setSearchLoading(false);
            }).catch(err => {
                // console.log(err);
                setSearchLoading(false);
            })
        }, 1200)

        return () => clearTimeout(fetchImages);
    }, [searchValue]);

    return (
        <div className={`${styles.photo__Search} ${className}`}>
            <section>
                <h2 className={styles.title}>Photo Search</h2>
                <p className={`${styles.subtitle} ${notoSans.className}`}>Search Unsplash for photos</p>
            </section>

            <SearchBar
                searchVal={searchValue}
                handleUpdateSearchValue={(name, val) => setSearchValue(val)}
                minWidth='unset'
                searchBtnIcon={IoIosSearch}
                searchBtnIconSize='1rem'
                searchBtnPadding='0.5rem 0.75rem'
                inputDisabled={searchLoading || searchDisabled}
            />

            {
                searchLoading ? <div style={{
                    margin: '0 auto'
                }}>
                    <Spinner
                        size='1.2rem'
                        borderWidth='4px'
                    />
                </div>
                    :
                    <div className={styles.search__Results}>
                        {
                            React.Children.toArray(searchResults.map((result: UnsplashSearchResult) => {
                                return <Image
                                    src={result?.urls?.small}
                                    alt='unsplash image'
                                    width={0}
                                    height={0}
                                    style={{
                                        objectFit: 'fill',
                                    }}
                                    className={styles.result__img}
                                    sizes='100vw'
                                    onClick={() => handleSelectPhoto(result?.urls?.regular, result?.user?.name, result?.user?.links?.html)}
                                    priority
                                />
                            }))
                        }
                    </div>
            }
        </div>
    )
}

export default PhotoSearch