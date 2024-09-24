import { getCurrentUserSession } from "@lib/auth";
import { prismaClient } from "@lib/prisma";
import { ListOrderItemUpdateType, validateListOrderDetails } from "@lib/validators/list";
import { generateNextResponse } from "@utils/responseGenerator";

export async function PATCH(
    req: Request,
    { params }: {
        params: {
            boardId: string,
        }
    },
) {
    const { boardId } = params;
    if (!boardId) return generateNextResponse('Invalid request', 400);

    const userSession = await getCurrentUserSession();
    if (!userSession) return generateNextResponse('You must be logged in to access this', 401);

    const data = await req.json();

    const { value, error } = validateListOrderDetails(data);
    if (error) return generateNextResponse(error.details[0]?.message, 400);

    try {
        const existingBoard = await prismaClient.board.findUnique({
            where: {
                id: boardId,
            },
            include: {
                lists: true,
            }
        });
        if (!existingBoard) return generateNextResponse('Board details not found', 404);

        try {
            const userIsABoardMember = await prismaClient.boardMembers.findFirst({
                where: {
                    boardId: boardId,
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
        await prismaClient.$transaction(value.lists.map((list: ListOrderItemUpdateType) => {
            return prismaClient.list.update({
                where: {
                    id: list.id,
                },
                data: {
                    listIndex: list.listIndex,
                },
            })
        }));

        return generateNextResponse('Successfully updated order of lists in board!', 200);
    } catch (error) {
        return generateNextResponse('An error occurred while trying to validate your request', 500);
    }
}