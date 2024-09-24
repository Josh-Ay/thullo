import { defaultMetadata } from '@utils/utils';
import styles from './styles.module.css'
import { headers } from 'next/headers';
import { UserService } from '@services/userService';
import ProfileDetails from './details';

export async function generateMetadata({
    params,
}: {
    params: {
        [key: string]: string,
    };
}) {
    const { userId } = params;

    if (!userId) return {
        ...defaultMetadata,
        title: "Profile | Thullo",
    };

    const headersList = headers();

    const host = headersList.get('host');
    const protocol = headersList.get('x-forwarded-proto') || 'http';

    const currentHostUrl = `${protocol}://${host}`;

    const userService = new UserService();

    try {
        const res = await userService.getUserDetails(userId, currentHostUrl);
        return {
            ...defaultMetadata,
            title: `${res?.name ?? 'Profile'} | Thullo`,
        }
    } catch (error) {
        return {
            ...defaultMetadata,
            title: "Profile | Thullo",
        };
    }
}

const ProfilePage = ({
    params,
}: {
    params: {
        [key: string]: string,
    };
}) => {
    const { userId } = params;

    if (!userId) return <></>

    return <section className={styles.main__Wrap}>
        <section className={styles.main__Content}>
            <h3 className={styles.title}>Profile</h3>
            <ProfileDetails id={userId} />
        </section>
    </section>
}

export default ProfilePage