import Image from "next/image";
import React from "react";
import { FaCaretDown } from "react-icons/fa6";
import styles from "./styles.module.css";
import { notoSans } from "@app/layout";
import { MdAccountCircle } from "react-icons/md";
import { IoLogOutSharp } from "react-icons/io5";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import CustomHr from "@components/CustomHr/CustomHr";
import { useRouter } from "next/navigation";

const ProfileItem = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const handleSignout = async () => {
        await signOut();

        router.push("/auth/login");
    }

    return (
        <section className={styles.profile}>
            <Image
                src={session?.user?.image ?? ''}
                alt="user photo"
                width={32}
                height={32}
                className={styles.profile__Img}
            />

            <p className={notoSans.className}>{session?.user?.name}</p>

            <FaCaretDown />

            <ul className={styles.profile__Actions}>
                <li>
                    <Link href={`/profile/${session?.user.id}`} className={styles.link__Item}>
                        <MdAccountCircle size={"1rem"} />
                        <span>My Profile</span>
                    </Link>
                </li>

                <CustomHr />

                <li onClick={handleSignout}>
                    <Link href={""} className={styles.link__Item}>
                        <IoLogOutSharp size={"1rem"} />
                        <span>Logout</span>
                    </Link>
                </li>
            </ul>
        </section>
    );
};

export default ProfileItem;
