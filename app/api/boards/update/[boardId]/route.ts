import { getCurrentUserSession } from "@lib/auth";
import { prismaClient } from "@lib/prisma";
import { validateBoardDetails } from "@lib/validators/board";
import { generateNextResponse } from "@utils/responseGenerator";

export async function PATCH(
    req: Request,
    { params }: {
        params: {
            boardId: string,
        }
    }
) {
    const { boardId } = params;
    if (!boardId) return generateNextResponse('Invalid request', 400);

    const userSession = await getCurrentUserSession();
    if (!userSession) return generateNextResponse('You must be logged in to access this', 401);

    const data = await req.json();

    const { value, error } = validateBoardDetails(data, true);
    if (error) return generateNextResponse(error.details[0]?.message, 400);

    try {
        const existingBoard = await prismaClient.board.findUnique({
            where: {
                id: boardId,
            },
        });
        if (!existingBoard) return generateNextResponse('Board details not found', 404);

        try {
            const userIsABoardMember = await prismaClient.boardMembers.findFirst({
                where: {
                    boardId: boardId,
                    userId: userSession.userId,
                }
            });
            if (!userIsABoardMember) return generateNextResponse('You cannot update this board because you are not a member of this board', 403);
        } catch (error) {
            return generateNextResponse('An error occurred while trying to update board', 500);
        }
    } catch (error) {
        return generateNextResponse('An error occurred while trying to update board', 500);
    }

    try {
        const updatedBoard = await prismaClient.board.update({
            where: {
                id: boardId,
            },
            data: {
                ...value,
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

        return generateNextResponse('Successfully updated board details!', 200, {
            ...updatedBoard,
        })
    } catch (error) {
        return generateNextResponse('An error occurred while trying to update board', 500);
    }
}