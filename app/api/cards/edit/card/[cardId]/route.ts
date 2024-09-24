import { getCurrentUserSession } from "@lib/auth";
import { prismaClient } from "@lib/prisma";
import { validateCardDetails } from "@lib/validators/card";
import { generateNextResponse } from "@utils/responseGenerator";

export async function PATCH(
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

    const { value, error } = validateCardDetails(data);
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
                if (!userIsACardMember) return generateNextResponse('You cannot update this card because you are not a member', 403);
            } catch (error) {
                return generateNextResponse('An error occurred while trying to update card details', 500);
            }
        }

    } catch (error) {
        return generateNextResponse('An error occurred while trying to update card details', 500);
    }

    try {
        const updatedCard = await prismaClient.card.update({
            where: {
                id: cardId,
            },
            data: {
                title: value.title,
                coverImage: value.coverImage,
                coverImageAuthor: value.coverImageAuthor,
                coverImageAuthorProfile: value.coverImageAuthorProfile,
                description: value.description,
            },
        })

        return generateNextResponse('Successfully updated card details!', 200, {
            ...updatedCard,
        });
    } catch (error) {
        return generateNextResponse('An error occurred while trying to update card details', 500);
    }
}