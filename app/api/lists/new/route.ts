import { getCurrentUserSession } from "@lib/auth";
import { prismaClient } from "@lib/prisma";
import { validateListDetails } from "@lib/validators/list";
import { generateNextResponse } from "@utils/responseGenerator";

export async function POST(req: Request) {
    const userSession = await getCurrentUserSession();
    if (!userSession) return generateNextResponse('You must be logged in to access this', 401);

    const data = await req.json();

    const { value, error } = validateListDetails(data);
    if (error) return generateNextResponse(error.details[0]?.message, 400);

    let existingBoard;

    try {
        existingBoard = await prismaClient.board.findUnique({
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
            if (!userIsABoardMember) return generateNextResponse('You cannot add a new list to this board because you are not a member of this board', 403);
        } catch (error) {
            return generateNextResponse('An error occurred while trying to validate your new lsi', 500);
        }
    } catch (error) {
        return generateNextResponse('An error occurred while trying to validate your new list', 500);
    }

    try {
        const newList = await prismaClient.list.create({
            data: {
                ...value,
                creatorId: userSession.userId,
                listIndex: existingBoard.lists.length,
            }
        });

        return generateNextResponse('Successfully added new list!', 201, {
            ...newList,
            cards: []
        });

    } catch (error) {
        return generateNextResponse('An error occurred while trying to add your new list', 500);
    }
}