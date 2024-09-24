import { getCurrentUserSession } from "@lib/auth";
import { prismaClient } from "@lib/prisma";
import { generateNextResponse } from "@utils/responseGenerator";

export async function GET(req: Request) {
    const params = new URLSearchParams(req.url.split('/api/search')[1]);

    const searchQuery = params.get('query');
    if (!searchQuery) return generateNextResponse("'query' missing in search params", 400);

    const userSession = await getCurrentUserSession();
    if (!userSession) return generateNextResponse('You must be logged in to access this', 401);

    try {
        const searchResults = await prismaClient.$transaction([
            prismaClient.board.findMany({
                take: 10,
                where: {
                    title: {
                        contains: searchQuery,
                        mode: 'insensitive',
                    },
                    members: {
                        some: {
                            userId: userSession.userId,
                        }
                    }
                },
            }),
            prismaClient.list.findMany({
                take: 10,
                where: {
                    title: {
                        contains: searchQuery,
                        mode: 'insensitive'
                    },
                    board: {
                        members: {
                            some: {
                                userId: userSession.userId,
                            }
                        }
                    }
                },
            }),
            prismaClient.card.findMany({
                take: 10,
                where: {
                    title: {
                        contains: searchQuery,
                        mode: 'insensitive'
                    },
                    list: {
                        board: {
                            members: {
                                some: {
                                    userId: userSession.userId,
                                }
                            },
                        }
                    }
                },
            }),
        ]);

        return generateNextResponse(`Successfully fetched results matching '${searchQuery}'`, 200, {
            results: {
                boards: searchResults[0],
                lists: searchResults[1],
                cards: searchResults[2],
            },
        });
    } catch (error) {
        return generateNextResponse(`An error occured while trying to search for ${searchQuery}. Please try again later`, 500);
    }
}