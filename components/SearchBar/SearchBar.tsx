'use client';

import React from 'react'
import styles from './styles.module.css'
import CustomButton from '@components/CustomButton/CustomButton';
import { IconType } from 'react-icons';
import Spinner from '@components/Spinner/Spinner';
import SearchResultsWrap from './SearchResultsWrap';


const SearchBar = ({
    searchVal = "",
    handleUpdateSearchValue = (name, val) => { },
    placeholder = "Keyword...",
    searchBtnText,
    searchBtnIcon,
    searchBtnIconSize,
    searchBtnPadding,
    minWidth,
    inputDisabled,
    hideSearchBtn = false,
    loading = false,
    spinnerSize = '1.625rem',
    results = null,
    showResultsWrap = false,
}: {
    searchVal?: string;
    handleUpdateSearchValue?: (name: string, val: string) => void;
    placeholder?: string;
    searchBtnText?: string;
    searchBtnIcon?: IconType;
    searchBtnIconSize?: string;
    searchBtnPadding?: string;
    minWidth?: string;
    inputDisabled?: boolean;
    hideSearchBtn?: boolean;
    loading?: boolean;
    spinnerSize?: string;
    results?: SearchResultFormatType | null;
    showResultsWrap?: boolean;
}) => {
    return (
        <div
            className={styles.search__Bar}
            style={{
                minWidth,
            }}
        >
            <input
                type='text'
                placeholder={placeholder}
                value={searchVal}
                onChange={({ target }) => handleUpdateSearchValue(target.name, target.value)}
                disabled={inputDisabled}
                readOnly={inputDisabled}
            />

            {
                hideSearchBtn ? <></>
                    :
                    loading ? <Spinner
                        size={spinnerSize}
                    /> :
                        <CustomButton
                            title={searchBtnText}
                            icon={searchBtnIcon}
                            iconSize={searchBtnIconSize}
                            padding={searchBtnPadding}
                        />
            }



            {
                showResultsWrap && searchVal.length > 0 &&
                <SearchResultsWrap
                    results={results}
                    loading={loading}
                />
            }
        </div>
    )
}

export default SearchBar