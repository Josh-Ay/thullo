import { getCurrentUserSession } from "@lib/auth";
import { prismaClient } from "@lib/prisma";
import { validateListDetails } from "@lib/validators/list";
import { generateNextResponse } from "@utils/responseGenerator";

export async function PATCH(
    req: Request,
    { params }: {
        params: {
            listId: string,
        }
    },
) {
    const { listId } = params;
    if (!listId) return generateNextResponse('Invalid request', 400);

    const userSession = await getCurrentUserSession();
    if (!userSession) return generateNextResponse('You must be logged in to access this', 401);

    const data = await req.json();

    const { value, error } = validateListDetails(data);
    if (error) return generateNextResponse(error.details[0]?.message, 400);

    try {
        const existingBoard = await prismaClient.board.findUnique({
            where: {
                id: value.boardId,
            },
            include: {
                lists: true,
            }
        });
        if (!existingBoard) return generateNextResponse('Board details not found', 404);

        try {
            const userIsABoardMember = await prismaClient.boardMembers.findFirst({
                where: {
                    boardId: value.boardId,
                    userId: userSession.userId,
                }
            });
            if (!userIsABoardMember) return generateNextResponse('You cannot edit this list because you are not a member of this board', 403);
        } catch (error) {
            return generateNextResponse('An error occurred while trying to validate your request', 500);
        }
    } catch (error) {
        return generateNextResponse('An error occurred while trying to validate your request', 500);
    }

    try {
        const updatedList = await prismaClient.list.update({
            where: {
                id: listId,
            },
            data: {
                title: value.title,
            },
            include: {
                cards: {
                    include: {
                        labels: true,
                    },
                    orderBy: {
                        cardIndex: 'asc'
                    }
                },
            },
        });

        return generateNextResponse('Successfully updated list details!', 200, {
            ...updatedList,
        })
    } catch (error) {
        return generateNextResponse('An error occurred while trying to validate your request', 500);
    }
}