import { defaultMetadata } from '@utils/utils';
import { Metadata } from 'next';
import React from 'react';
import styles from './styles.module.css';
import BoardsTitleSection from '@components/BoardsTitleSection/BoardsTitleSection';
import BoardsLandingListing from './contents';

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "All Boards | Thullo",
};

const AllBoards = () => {

    return (
        <section className={styles.main__Wrap}>
            <BoardsTitleSection
                title='All Boards'
            />

            <BoardsLandingListing />
        </section>
    )
}

export default AllBoards;