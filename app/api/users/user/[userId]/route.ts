import { prismaClient } from "@lib/prisma";
import { generateNextResponse } from "@utils/responseGenerator";

export async function GET(
    req: Request,
    { params }: {
        params: {
            userId: string,
        }
    },
) {
    const { userId } = params;
    if (!userId) return generateNextResponse('Invalid request', 400);

    const searchParams = new URLSearchParams(req.url.split(`/api/users/user/${userId}`)[1]);
    const isPublicQuery = searchParams.get('publicView');

    if (isPublicQuery) {
        try {
            const user = await prismaClient.user.findFirst({
                where: {
                    id: userId,
                },
                select: {
                    name: true,
                },
            });

            return generateNextResponse('Successfully fetched user details!', 200, {
                ...user,
            });
        } catch (error) {
            return generateNextResponse('An error occured while trying to fetch user detail', 500);
        }
    }

    try {
        const user = await prismaClient.user.findFirst({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
                name: true,
                profilePhoto: true,
                createdAt: true,
                _count: {
                    select: {
                        boardsCreated: true,
                        cards: true,
                        comments: true,
                    }
                }
            },
        });

        if (!user) return generateNextResponse('User details not found', 404);

        return generateNextResponse('Successfully fetched user details!', 200, {
            ...user,
        });
    } catch (error) {
        return generateNextResponse('An error occured while trying to fetch user detail', 500);
    }
}