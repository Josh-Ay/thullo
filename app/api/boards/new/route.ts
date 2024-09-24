import { getCurrentUserSession } from "@lib/auth";
import { prismaClient } from "@lib/prisma";
import { validateBoardDetails } from "@lib/validators/board";
import { generateNextResponse } from "@utils/responseGenerator";

export async function POST(req: Request) {
    const userSession = await getCurrentUserSession();
    if (!userSession) return generateNextResponse('You must be logged in to access this', 401);

    const data = await req.json();

    const { value, error } = validateBoardDetails(data);
    if (error) return generateNextResponse(error.details[0]?.message, 400);

    try {
        const newBoard = await prismaClient.board.create({
            data: {
                ...value,
                creatorId: userSession.userId,
                members: {
                    create: {
                        userId: userSession.userId,
                    },
                }
            },
            include: {
                members: {
                    include: {
                        user: true,
                    }
                },
                lists: {
                    include: {
                        cards: true,
                    },
                },
                creator: true,
            },
        });

        return generateNextResponse('Successfully added new board!', 201, {
            ...newBoard,
        });
    } catch (error) {
        return generateNextResponse('An error occurred while trying to add your new board', 500);
    }
}