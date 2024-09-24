import { defaultMetadata } from '@utils/utils';
import { Metadata } from 'next';
import styles from './styles.module.css';
import InvitationPageContent from './contents';
import { Suspense } from 'react';
import Spinner from '@components/Spinner/Spinner';


export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Invite | Thullo",
};

const InvitePage = () => {
    return <section className={styles.main__Wrap}>
        <Suspense fallback={<Spinner />}>
            <InvitationPageContent />
        </Suspense>
    </section>
}

export default InvitePage;