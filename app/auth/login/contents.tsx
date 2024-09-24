"use client";

import CustomButton from '@components/CustomButton/CustomButton';
import { appColors } from '@utils/colors';
import { BuiltInProviderType } from 'next-auth/providers/index';
import { ClientSafeProvider, getProviders, LiteralUnion, signIn, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { AiOutlineGithub } from 'react-icons/ai';
import styles from '../styles.module.css'
import { IoLogoGoogle } from 'react-icons/io5';
import Spinner from '@components/Spinner/Spinner';
import { useSearchParams } from 'next/navigation';
import { saveInviteDetailsToStorage } from '@utils/utils';

const LoginPageContents = () => {
    const { status } = useSession();
    const searchParams = useSearchParams();

    const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null);

    useEffect(() => {
        const [
            inviteType,
            inviteItem,
            boardId,
        ] = [
            searchParams.get('inviteType'),
            searchParams.get('inviteItem'),
            searchParams.get('boardId'),
        ]

        if (inviteType && inviteItem && boardId) saveInviteDetailsToStorage(inviteType, inviteItem, boardId);

        getProviders().then(res => {
            setProviders(res);
        }).catch(() => {
            setProviders(null);
        });
    }, [])

    const handleOauthSignin = (oauthType: string) => {
        if (!providers) return;

        const foundOauthProvider = providers[oauthType];
        if (!foundOauthProvider) return;

        signIn(foundOauthProvider.id, {
            redirect: false,
            callbackUrl: '/boards/all',
        });
    }

    return (
        <section className={styles.oauth__Wrap}>
            {
                (status === "loading" || status === "authenticated") ?
                    <Spinner />
                    :
                    <>
                        <CustomButton
                            icon={IoLogoGoogle}
                            iconSize={'1.2rem'}
                            fontSize='0.75rem'
                            border={`1px solid ${appColors.primaryBlueColor}`}
                            padding='1rem'
                            backgroundColor='transparent'
                            color={appColors.primaryBlueColor}
                            title='Continue with google'
                            width='100%'
                            handleClick={() => handleOauthSignin('google')}
                        />

                        <CustomButton
                            icon={AiOutlineGithub}
                            iconSize={'1.2rem'}
                            fontSize='0.75rem'
                            border={`1px solid ${appColors.primaryBlueColor}`}
                            padding='1rem'
                            backgroundColor='transparent'
                            color={appColors.primaryBlueColor}
                            title='Continue with github'
                            width='100%'
                            handleClick={() => handleOauthSignin('github')}
                        />
                    </>
            }
        </section>
    )
}

export default LoginPageContents