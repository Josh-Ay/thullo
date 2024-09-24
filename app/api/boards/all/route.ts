import { getCurrentUserSession } from "@lib/auth";
import { prismaClient } from "@lib/prisma";
import { generateNextResponse } from "@utils/responseGenerator";

export async function GET() {
    const userSession = await getCurrentUserSession();
    if (!userSession) return generateNextResponse('You must be logged in to access this', 401);

    try {
        const res = await prismaClient.board.findMany({
            where: {
                members: {
                    some: {
                        userId: userSession.userId,
                    },
                },
            },
            include: {
                members: {
                    include: {
                        user: true,
                    }
                },
                lists: {
                    include: {
                        cards: {
                            include: {
                                labels: true,
                                members: {
                                    include: {
                                        user: true,
                                    }
                                },
                            },
                            orderBy: {
                                cardIndex: 'asc'
                            },
                        },
                    },
                    orderBy: {
                        listIndex: 'asc',
                    },
                },
                creator: true,
            },
            orderBy: {
                createdAt: 'desc',
            }
        })

        return generateNextResponse('Successfully fetched boards for user', 200, {
            boards: res,
        });
    } catch (error) {
        return generateNextResponse('An error occurred while trying to add fetch your boards', 500);
    }
}