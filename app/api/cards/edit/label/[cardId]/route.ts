import { getCurrentUserSession } from "@lib/auth";
import { prismaClient } from "@lib/prisma";
import { validateLabelDetails } from "@lib/validators/label";
import { generateNextResponse } from "@utils/responseGenerator";

export async function POST(
    req: Request,
    { params }: {
        params: {
            cardId: string,
        }
    },
) {
    const { cardId } = params;
    if (!cardId) return generateNextResponse('Invalid request', 400);

    const userSession = await getCurrentUserSession();
    if (!userSession) return generateNextResponse('You must be logged in to access this', 401);

    const data = await req.json();

    const { value, error } = validateLabelDetails(data);
    if (error) return generateNextResponse(error.details[0]?.message, 400);

    try {
        const existingCard = await prismaClient.card.findUnique({
            where: {
                id: cardId,
            },
        });
        if (!existingCard) return generateNextResponse('Card details not found', 404);

        if (existingCard.creatorId !== userSession.userId) {
            try {
                const userIsACardMember = await prismaClient.cardMembers.findFirst({
                    where: {
                        cardId: existingCard.id,
                        userId: userSession.userId,
                    }
                });
                if (!userIsACardMember) return generateNextResponse('You cannot add a label to this card because you are not a member of this board', 403);
            } catch (error) {
                return generateNextResponse('An error occurred while trying to add card label', 500);
            }
        }

    } catch (error) {
        return generateNextResponse('An error occurred while trying to add card label', 500);
    }

    try {
        const newCardLabel = await prismaClient.label.create({
            data: {
                cardId: cardId,
                name: value.name,
                color: value.color,
            },
        })

        return generateNextResponse('Successfully added new card label!', 200, {
            ...newCardLabel,
        });
    } catch (error) {
        return generateNextResponse('An error occurred while trying to add card label', 500);
    }
}