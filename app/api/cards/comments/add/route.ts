import { getCurrentUserSession } from "@lib/auth";
import { prismaClient } from "@lib/prisma";
import { validateCommentDetails } from "@lib/validators/comment";
import { generateNextResponse } from "@utils/responseGenerator";

export async function POST(req: Request) {
    const userSession = await getCurrentUserSession();
    if (!userSession) return generateNextResponse('You must be logged in to access this', 401);

    const data = await req.json();

    const { value, error } = validateCommentDetails(data);
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
                if (!userIsACardMember) return generateNextResponse('You cannot add a comment to this card because you are not a member of this card', 403);
            } catch (error) {
                return generateNextResponse('An error occurred while trying to add card label', 500);
            }
        }
    } catch (error) {
        return generateNextResponse('An error occurred while trying to add a new comment', 500);
    }

    try {
        const newCardComment = await prismaClient.comment.create({
            data: {
                authorId: userSession.userId,
                comment: value.comment,
                cardId: value.cardId,
            },
            include: {
                author: true,
            },
        });

        try {
            await prismaClient.card.update({
                where: {
                    id: existingCard.id,
                },
                data: {
                    totalComments: existingCard.totalComments + 1,
                }
            });
        } catch (error) {
            console.log('Error updating comment count: ', error);
        }

        return generateNextResponse('Successfully added new comment!', 201, {
            ...newCardComment,
        })
    } catch (error) {
        return generateNextResponse('An error occurred while trying to add a new comment', 500);
    }
}