import { prismaClient } from "@lib/prisma";
import { generateNextResponse } from "@utils/responseGenerator";

export async function GET(
    req: Request,
    { params }: {
        params: {
            cardId: string,
        }
    },
) {
    const { cardId } = params;
    if (!cardId) return generateNextResponse('Invalid request', 400);

    try {
        const existingCard = await prismaClient.card.findUnique({
            where: {
                id: cardId,
            },
        });
        if (!existingCard) return generateNextResponse('Card details not found', 404);
    } catch (error) {
        return generateNextResponse('An error occurred while trying to fetch comments', 500);
    }

    try {
        const comments = await prismaClient.comment.findMany({
            where: {
                cardId: cardId,
            },
            include: {
                author: true,
            },
            orderBy: {
                createdAt: 'desc',
            }
        })

        return generateNextResponse('Successfully fetched card comments!', 200, {
            comments,
        })
    } catch (error) {
        return generateNextResponse('An error occurred while trying to fetch comments', 500);
    }
}