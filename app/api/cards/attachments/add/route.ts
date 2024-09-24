import { getCurrentUserSession } from "@lib/auth";
import { prismaClient } from "@lib/prisma";
import { validateAttachmentDetails } from "@lib/validators/attachment";
import { generateNextResponse } from "@utils/responseGenerator";

export async function POST(req: Request) {
    const userSession = await getCurrentUserSession();
    if (!userSession) return generateNextResponse('You must be logged in to access this', 401);

    const data = await req.json();

    const { value, error } = validateAttachmentDetails(data);
    if (error) return generateNextResponse(error.details[0]?.message, 400);

    let existingCard;

    try {
        existingCard = await prismaClient.card.findUnique({
            where: {
                id: value.cardId,
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
                if (!userIsACardMember) return generateNextResponse('You cannot add an attachment to this card because you are not a member of this card', 403);
            } catch (error) {
                return generateNextResponse('An error occurred while trying to add an attachment', 500);
            }
        }
    } catch (error) {
        return generateNextResponse('An error occurred while trying to add a new attachment', 500);
    }

    try {
        const newAttachment = await prismaClient.attachment.create({
            data: {
                ...value,
                creatorId: userSession.userId,
            },
        });

        try {
            await prismaClient.card.update({
                where: {
                    id: existingCard.id,
                },
                data: {
                    totalAttachments: existingCard.totalAttachments + 1,
                }
            });
        } catch (error) {
            console.log('Error updating attachment count: ', error);
        }

        return generateNextResponse('Successfully added new attachment!', 201, {
            ...newAttachment,
        });
    } catch (error) {
        return generateNextResponse('An error occurred while trying to add a new attachment', 500);
    }
}