import React from 'react';
import { defaultMetadata } from '@utils/utils';
import styles from './styles.module.css';
import { Metadata } from 'next';
import SearchContents from './contents';

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Loading | Thullo",
};

const ItemDetailPage = () => {
    return <section className={styles.main__Wrap}>
        <SearchContents />
    </section>
}

export default ItemDetailPage;