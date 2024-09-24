import { defaultMetadata } from '@utils/utils';
import { Metadata } from 'next';
import styles from './styles.module.css';
import InvitationPageContent from './contents';


export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Invite | Thullo",
};

const InvitePage = () => {
    return <section className={styles.main__Wrap}>
        <InvitationPageContent />
    </section>
}

export default InvitePage;