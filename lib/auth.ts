import { getServerSession, NextAuthOptions, Session } from "next-auth";
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { prismaClient } from "./prisma";
import { cache } from "react";

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID ?? '',
            clientSecret: process.env.GITHUB_SECRET ?? '',
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID ?? '',
            clientSecret: process.env.GOOGLE_SECRET ?? '',
        }),
    ],
    callbacks: {
        async signIn({ user, account }): Promise<boolean> {
            if (!user.email || !user.id || !account?.provider) return false;

            try {
                const existingUser = await prismaClient.user.findUnique({
                    where: {
                        email: user?.email,
                    },
                });

                if (!existingUser) {
                    try {
                        await prismaClient.user.create({
                            data: {
                                name: user.name ?? `User${user?.id}`,
                                email: user?.email,
                                profilePhoto: user?.image,
                                oauthClientId: user?.id,
                                oauthProvider: account?.provider,
                            }
                        });

                        return true;
                    } catch (error) {
                        return false;
                    }
                }

                if (existingUser.oauthProvider !== account?.provider) return false;

                return true;
            } catch (error) {
                return false;
            }
        },
        async session({ session }) {
            if (session && session.user && session.user?.email) {
                try {
                    const foundUser = await prismaClient.user.findUnique({
                        where: {
                            email: session?.user?.email
                        }
                    });

                    session.user.id = foundUser?.id;
                } catch (error) { }

                return session;
            }

            return session;
        }
    },
}

interface CurrentUserSession {
    email: string,
    userId: string,
    name: string,
    image?: string | null,
}

export const getCurrentUserSession = cache(async (): Promise<CurrentUserSession | null> => {
    const session: Session | null = await getServerSession(authOptions);
    if (
        !session ||
        !session.user ||
        !session.user.email ||
        !session.user.id ||
        !session.user.name
    ) return null;

    const userSessionDetails: CurrentUserSession = {
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user?.image,
    }

    return userSessionDetails;
})