import { getCurrentUserSession } from "@lib/auth";
import { prismaClient } from "@lib/prisma";
import { generateNextResponse } from "@utils/responseGenerator";

export async function GET(
    req: Request,
    { params }: {
        params: {
            boardId: string,
        }
    }
) {
    const { boardId } = params;
    if (!boardId) return generateNextResponse('Invalid request', 400);

    const searchParams = new URLSearchParams(req.url.split(`/api/boards/board/${boardId}`)[1]);
    const viewType = searchParams.get('view');

    if (viewType && viewType === "public") {
        try {
            const foundBoard = await prismaClient.board.findUnique({
                where: {
                    id: boardId,
                },
                select: {
                    title: true,
                    description: true,
                },
            })

            if (!foundBoard) return generateNextResponse('Board details not found', 404);

            return generateNextResponse('Successfully fetched board details', 200, {
                ...foundBoard,
            });

        } catch (error) {
            return generateNextResponse('An error occured while trying to fetch the details for the requested board, please try again later', 500);
        }
    }

    try {
        const foundBoard = await prismaClient.board.findUnique({
            where: {
                id: boardId,
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
            }
        })

        if (!foundBoard) return generateNextResponse('Board details not found', 404);

        if (foundBoard.visibility === 'public') return generateNextResponse('Successfully fetched board details', 200, {
            ...foundBoard,
        });

        const userSession = await getCurrentUserSession();
        if (!userSession) return generateNextResponse('You must be logged in to access this', 401);

        if (!foundBoard.members.find(member => member.userId === userSession.userId)) return generateNextResponse('You cannot view this board because you are not a member', 403);

        return generateNextResponse('Successfully fetched board details', 200, {
            ...foundBoard,
        });

    } catch (error) {
        return generateNextResponse('An error occured while trying to fetch the details for the requested board, please try again later', 500);
    }
}