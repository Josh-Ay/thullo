'use client';

import { UserService } from "@services/userService";
import { useEffect, useState } from "react";
import styles from './styles.module.css';
import Image from "next/image";
import { notoSans } from "@app/layout";
import Spinner from "@components/Spinner/Spinner";
import { IoChatboxEllipsesOutline, IoStatsChartOutline } from "react-icons/io5";
import { GoWorkflow } from "react-icons/go";
import { formatDateAndTimeForApp } from "@utils/utils";
import { useAppContext } from "@contexts/AppContext";


const ProfileDetails = ({
    id,
}: {
    id: string,
}) => {
    const {
        setCurrentBoardDetails
    } = useAppContext();
    
    const [dataLoading, setDataLoading] = useState(false);
    const [userDetails, setUserDetails] = useState<UserProfileType | null>(null);

    const userService = new UserService();

    useEffect(() => {
        setCurrentBoardDetails(null);
        setDataLoading(true);

        userService.getUserDetails(id).then(res => {
            setUserDetails(res);
            setDataLoading(false);
        }).catch(() => {
            setDataLoading(false);
            setUserDetails(null);
        });
    }, [])

    return <section className={styles.profile__Content}>
        <>
            {
                dataLoading ? <Spinner />
                    :
                    !userDetails ?
                        <>
                            <h3
                                className={styles.subtitle}
                            >
                                User Details invalid or missing
                            </h3>
                        </>
                        :
                        <>
                            {
                                ((!userDetails?.profilePhoto || userDetails?.profilePhoto?.length < 1)) ?
                                    <></> :
                                    <Image
                                        src={userDetails?.profilePhoto}
                                        alt='user image'
                                        width={0}
                                        height={0}
                                        sizes='100vw'
                                        className={styles.user__Img}
                                        style={{
                                            objectFit: 'cover',
                                        }}
                                        priority
                                    />
                            }

                            <div className={styles.details}>
                                <h3
                                    className={styles.title}
                                >
                                    {userDetails?.name}
                                </h3>
                                <p className={`${notoSans.className} ${styles.subtitle}`}>{userDetails?.email}</p>
                                <p className={`${notoSans.className} ${styles.subtitle_2}`}>Joined {formatDateAndTimeForApp(userDetails?.createdAt ?? '')}</p>
                            </div>

                            <div className={styles.stat__Wrap}>
                                <div className={styles.stat}>
                                    <div className={styles.stat__Icon}>
                                        <IoStatsChartOutline size={'1rem'} />
                                    </div>
                                    <div className={styles.stat__Info}>
                                        <h5 className={styles.title}>{userDetails?._count?.boardsCreated ? Number(userDetails?._count?.boardsCreated).toLocaleString() : 0}</h5>
                                        <p className={`${notoSans.className} ${styles.subtitle}`}>Total Boards Created</p>
                                    </div>
                                </div>

                                <div className={styles.stat}>
                                    <div className={styles.stat__Icon}>
                                        <GoWorkflow size={'1rem'} />
                                    </div>
                                    <div className={styles.stat__Info}>
                                        <h5 className={styles.title}>{userDetails?._count?.cards ? Number(userDetails?._count?.cards).toLocaleString() : 0}</h5>
                                        <p className={`${notoSans.className} ${styles.subtitle}`}>Total Cards</p>
                                    </div>
                                </div>

                                <div className={styles.stat}>
                                    <div className={styles.stat__Icon}>
                                        <IoChatboxEllipsesOutline size={'1rem'} />
                                    </div>
                                    <div className={styles.stat__Info}>
                                        <h5 className={styles.title}>{userDetails?._count?.comments ? Number(userDetails?._count?.comments).toLocaleString() : 0}</h5>
                                        <p className={`${notoSans.className} ${styles.subtitle}`}>Total Comments</p>
                                    </div>
                                </div>
                            </div>
                        </>
            }
        </>
    </section>
}

export default ProfileDetails