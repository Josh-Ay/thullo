import { getCurrentUserSession } from "@lib/auth";
import { prismaClient } from "@lib/prisma";
import { validateBoardDetails } from "@lib/validators/board";
import { generateNextResponse } from "@utils/responseGenerator";

export async function POST(req: Request) {
    const userSession = await getCurrentUserSession();
    if (!userSession) return generateNextResponse('You must be logged in to access this', 401);

    const data = await req.json();

    const { value, error } = validateBoardDetails(data, { isMemberDeleteRequest: true });
    if (error) return generateNextResponse(error.details[0]?.message, 400);

    let existingBoard, existingBoardMember;

    try {
        [
            existingBoard,
            existingBoardMember,
        ] = await prismaClient.$transaction([
            prismaClient.board.findUnique({
                where: {
                    id: value.boardId,
                },
                include: {
                    lists: {
                        select: {
                            cards: true,
                        },
                    },
                },
            }),
            prismaClient.boardMembers.findFirst({
                where: {
                    boardId: value.boardId,
                    userId: value.userId,
                },
            }),
        ]);
        
        if (!existingBoard) return generateNextResponse('Board details not found', 404);
        if (!existingBoardMember) return generateNextResponse('User is not an existing member of this board', 404);

        if (existingBoard.creatorId !== userSession.userId) return generateNextResponse('Only the board creator is permitted to perform this action', 403);
        if (existingBoard.creatorId === value.userId) return generateNextResponse('You cannot remove yourself from a board you created', 403)
    } catch (error) {
        return generateNextResponse('An error occurred while trying to delete requested board member', 500);
    }

    const idsOfCardsInBoard = existingBoard.lists.flatMap(list => list.cards.map(card => card.id));

    try {
        await prismaClient.$transaction([
            prismaClient.boardMembers.delete({
                where: {
                    id: existingBoardMember.id,
                }
            }),
            prismaClient.cardMembers.deleteMany({
                where: {
                    userId: value.userId,
                    cardId: {
                        in: idsOfCardsInBoard,
                    },
                },
            }),
        ]);

        return generateNextResponse('Successfully removed member from board');
    } catch (error) {
        return generateNextResponse('An error occurred while trying to delete requested board member', 500);
    }
}