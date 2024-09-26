import { getCurrentUserSession } from "@lib/auth";
import { prismaClient } from "@lib/prisma";
import { generateNextResponse } from "@utils/responseGenerator";

export async function GET(req: Request) {
    const params = new URLSearchParams(req.url.split('/api/users/search')[1]);

    const searchQuery = params.get('query');
    if (!searchQuery) return generateNextResponse("'query' missing in search params", 400);

    const userSession = await getCurrentUserSession();
    if (!userSession) return generateNextResponse('You must be logged in to access this', 401);

    try {
        const foundUsers = await prismaClient.user.findMany({
            take: 50,
            where: {
                email: {
                    contains: searchQuery,
                    mode: 'insensitive',
                    not: userSession.email,
                },
                name: {
                    contains: searchQuery,
                    mode: 'insensitive',
                    not: userSession.name,
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                profilePhoto: true,
            },
        });

        return generateNextResponse('Successfully fetched user results!', 200, {
            results: foundUsers,
        })
    } catch (error) {
        return generateNextResponse('An error occured while trying to execute your search query. Please try again later', 500);
    }
}