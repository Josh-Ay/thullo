import { getCurrentUserSession } from "@lib/auth";
import { prismaClient } from "@lib/prisma";
import { ValidInviteTypes, validInviteTypesList } from "@lib/validators/user";
import { generateNextResponse } from "@utils/responseGenerator";

export async function POST(req: Request) {
    const params = new URLSearchParams(req.url.split('/api/users/invite/join')[1]);

    const [
        inviteType,
        itemId,
        boardId,
    ] = [
            params.get('type')?.toLocaleLowerCase(),
            params.get('id'),
            params.get('boardId'),
        ];

    if (!inviteType) return generateNextResponse("'type' missing in search params", 400);
    if (!itemId) return generateNextResponse("'id' missing in search params", 400);
    if (!boardId) return generateNextResponse("'boardId' missing in search params", 400);
    if (!validInviteTypesList.includes(inviteType as ValidInviteTypes)) return generateNextResponse(`'type' must be one of ${validInviteTypesList.join(', ')}`, 400);

    const userSession = await getCurrentUserSession();
    if (!userSession) return generateNextResponse('You must be logged in to access this', 401);

    let existingBoard, existingBoardMember;

    try {
        existingBoard = await prismaClient.board.findUnique({
            where: {
                id: boardId,
            },
            include: {
                members: true,
            },
        });

        if (!existingBoard) return generateNextResponse('Board details not found', 404);
        existingBoardMember = existingBoard.members.find(member => member.userId === userSession.userId);
    } catch (error) {
        return generateNextResponse('An error occurred while trying to process your invite request', 500);
    }

    if (inviteType === ValidInviteTypes.boardInvite) {
        if (existingBoardMember) return generateNextResponse('You are already a member of this board', 403);

        try {
            const newBoardMember = await prismaClient.boardMembers.create({
                data: {
                    boardId: existingBoard.id,
                    userId: userSession.userId,
                },
            });

            return generateNextResponse('Successfully joined board!', 201, {
                ...existingBoard,
                members: [
                    ...existingBoard.members,
                    newBoardMember,
                ],
            });
        } catch (error) {
            return generateNextResponse('An error occurred while trying to process your invite request', 500);
        }
    }

    if (inviteType === ValidInviteTypes.cardInvite) {
        try {
            const existingCardMember = await prismaClient.cardMembers.findFirst({
                where: {
                    userId: userSession.userId,
                }
            })
            if (existingCardMember) return generateNextResponse('You are already a member of this card', 403);
        } catch (error) {
            return generateNextResponse('An error occurred while trying to process your invite request', 500);
        }

        if (!existingBoardMember) {
            try {
                await prismaClient.boardMembers.create({
                    data: {
                        boardId: existingBoard.id,
                        userId: userSession.userId,
                    },
                });
            } catch (error) {
                return generateNextResponse('An error occurred while trying to process your invite request', 500);
            }
        }

        try {
            const foundCard = await prismaClient.card.findUnique({
                where: {
                    id: itemId,
                },
            });
            if (!foundCard) return generateNextResponse('Card details not found', 404);

            try {
                const newCardMember = await prismaClient.cardMembers.create({
                    data: {
                        cardId: itemId,
                        userId: userSession.userId,
                    },
                    include: {
                        user: true,
                    }
                });

                return generateNextResponse('Successfully joined card!', 201, {
                    ...newCardMember,
                });
            } catch (error) {
                return generateNextResponse('An error occurred while trying to process your invite request', 500);
            }

        } catch (error) {
            return generateNextResponse('An error occurred while trying to process your invite request', 500);
        }
    }

    return generateNextResponse('An error occurred while trying to process your invite request', 500);
}