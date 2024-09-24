import { getCurrentUserSession } from "@lib/auth";
import { prismaClient } from "@lib/prisma";
import { CardListOrderUpdateType, validateCardListOrderDetail } from "@lib/validators/card";
import { generateNextResponse } from "@utils/responseGenerator";

export async function POST(req: Request) {
    const userSession = await getCurrentUserSession();
    if (!userSession) return generateNextResponse('You must be logged in to access this', 401);

    const data = await req.json();

    const { value, error } = validateCardListOrderDetail(data);
    if (error) return generateNextResponse(error.details[0]?.message, 400);

    try {
        const existingBoard = await prismaClient.board.findUnique({
            where: {
                id: value.boardId,
            },
        });
        if (!existingBoard) return generateNextResponse('Board details not found', 404);

        try {
            const userIsABoardMember = await prismaClient.boardMembers.findFirst({
                where: {
                    boardId: value.boardId,
                    userId: userSession.userId,
                }
            });
            if (!userIsABoardMember) return generateNextResponse('You cannot update cards in this list because you are not a member of this board', 403);
        } catch (error) {
            return generateNextResponse('An error occurred while trying to update your cards', 500);
        }
    } catch (error) {
        return generateNextResponse('An error occurred while trying to update your cards', 500);
    }

    try {
        await prismaClient.$transaction(value.cards?.map((card: CardListOrderUpdateType) => {
            return prismaClient.card.update({
                where: {
                    id: card.id
                },
                data: {
                    cardIndex: card.cardIndex,
                    listId: card.listId,
                },
            })
        }));

        return generateNextResponse('Successfully updated cards!')

    } catch (error) {
        return generateNextResponse('An error occurred while trying to update your cards', 500);
    }
}