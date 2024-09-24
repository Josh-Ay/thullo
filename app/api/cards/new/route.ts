import { getCurrentUserSession } from "@lib/auth";
import { prismaClient } from "@lib/prisma";
import { validateCardDetails } from "@lib/validators/card";
import { generateNextResponse } from "@utils/responseGenerator";

export async function POST(req: Request) {
    const userSession = await getCurrentUserSession();
    if (!userSession) return generateNextResponse('You must be logged in to access this', 401);

    const data = await req.json();

    const { value, error } = validateCardDetails(data);
    if (error) return generateNextResponse(error.details[0]?.message, 400);

    let existingList;

    try {
        existingList = await prismaClient.list.findUnique({
            where: {
                id: value.listId,
            },
            include: {
                cards: true,
            }
        });
        if (!existingList) return generateNextResponse('List details not found', 404);

        try {
            const userIsABoardMember = await prismaClient.boardMembers.findFirst({
                where: {
                    boardId: existingList.boardId,
                    userId: userSession.userId,
                }
            });
            if (!userIsABoardMember) return generateNextResponse('You cannot add cards to this list because you are not a member of this board', 403);
        } catch (error) {
            return generateNextResponse('An error occurred while trying to validate your new card', 500);
        }

    } catch (error) {
        return generateNextResponse('An error occurred while trying to validate your new card', 500);
    }


    try {
        const newCard = await prismaClient.card.create({
            data: {
                ...value,
                creatorId: userSession.userId,
                cardIndex: existingList.cards.length,
            },
            include: {
                labels: true,
                comments: true,
                attachments: true,
                members: true,
            },
        });

        return generateNextResponse('Successfully added new card!', 201, {
            ...newCard,
        });

    } catch (error) {
        return generateNextResponse('An error occurred while trying to add your new card', 500);
    }
}