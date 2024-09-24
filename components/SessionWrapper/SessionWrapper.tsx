"use client";

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react'
import React from 'react'

const SessionWrapper = ({
    children,
    session,
}: Readonly<{
    children: React.ReactNode,
    session?: Session,
}>) => {
    return (
        <>
            <SessionProvider session={session}>
                {children}
            </SessionProvider>
        </>
    )
}

export default SessionWrapper