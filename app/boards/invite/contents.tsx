'use client';

import Spinner from "@components/Spinner/Spinner";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { UserService } from "@services/userService";
import CustomButton from "@components/CustomButton/CustomButton";
import { useAppContext } from "@contexts/AppContext";
import { useSession } from "next-auth/react";


const InvitationPageContent = () => {
    const [loading, setLoading] = useState(true);
    const [inviteProcessed, setInviteProcessed] = useState(false);
    const [result, setResult] = useState('');

    const router = useRouter();

    const { status } = useSession();

    const searchParams = useSearchParams();

    const userService = new UserService();

    const {
        setAllBoardsLoaded,
    } = useAppContext();

    useEffect(() => {
        if (inviteProcessed) {
            setLoading(false);
            setResult('');
            return;
        }

        const type = searchParams.get('type');
        const itemId = searchParams.get('id');
        const boardId = searchParams.get('boardId');

        if (!type || !itemId || !boardId) {
            setLoading(false);
            setResult('Invitation link is invalid');

            return;
        }

        if (status === 'loading') return;

        localStorage.clear();

        if (status === 'unauthenticated') {
            router.push(`/auth/login?inviteType=${type}&inviteItem=${itemId}&boardId=${boardId}`)
            return;
        }

        userService.acceptInvite(itemId, type, boardId).then(res => {
            setLoading(false);
            setResult('Successfully accepted invite!');
            setAllBoardsLoaded(false);
            setInviteProcessed(true);
        }).catch((err) => {
            setLoading(false);
            setResult(err?.message as string);
            setInviteProcessed(true);
        })

    }, [status])

    return <section className={styles.content__Wrap}>
        {
            loading ? <Spinner /> : <>
                <p>{result}</p>
                <CustomButton
                    title="Go home"
                    useLink={true}
                    linkLocation={'/boards/all'}
                />
            </>
        }
    </section>
}

export default InvitationPageContent;