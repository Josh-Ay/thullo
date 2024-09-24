import { getCurrentUserSession } from "@lib/auth";
import { prismaClient } from "@lib/prisma";
import { validateInviteDetails, ValidInviteTypes, validInviteTypesList } from "@lib/validators/user";
import { compileHtml, sendEmail } from "@utils/mailSender";
import { generateNextResponse } from "@utils/responseGenerator";

export async function POST(req: Request) {
    const params = new URLSearchParams(req.url.split('/api/users/invite/new')[1]);

    const inviteType = params.get('type')?.toLocaleLowerCase();
    if (!inviteType) return generateNextResponse("'type' missing in search params", 400);
    if (!validInviteTypesList.includes(inviteType as ValidInviteTypes)) return generateNextResponse(`'type' must be one of ${validInviteTypesList.join(', ')}`, 400);

    const userSession = await getCurrentUserSession();
    if (!userSession) return generateNextResponse('You must be logged in to access this', 401);

    const data = await req.json();

    const { value, error } = validateInviteDetails(data, inviteType as ValidInviteTypes);
    if (error) return generateNextResponse(error.details[0]?.message, 400);

    let existingBoard, itemTitle;

    try {
        existingBoard = await prismaClient.board.findUnique({
            where: {
                id: value.boardId,
            },
        });
        if (!existingBoard) return generateNextResponse('Board details not found', 404);
        if (existingBoard.creatorId !== userSession.userId) return generateNextResponse('Only the creators of a board can invite other members', 403);

        itemTitle = existingBoard.title;
    } catch (error) {
        return generateNextResponse('An error occurred while trying to process your invite request', 500);
    }

    if (inviteType === ValidInviteTypes.cardInvite) {
        try {
            const existingCard = await prismaClient.card.findUnique({
                where: {
                    id: value.cardId,
                },
            });
            if (!existingCard) return generateNextResponse('Card details not found', 404);

            itemTitle = `'${existingCard.title}' in the board titled: '${existingBoard.title}'`;
        } catch (error) {
            return generateNextResponse('An error occurred while trying to process your invite request', 500);
        }
    }

    const inviteLink = `${process.env.SERVER_URL}/boards/invite?id=${inviteType === ValidInviteTypes.cardInvite ?
        value.cardId
        :
        inviteType === ValidInviteTypes.boardInvite ?
            value.boardId
            :
            ''
        }&type=${inviteType}&boardId=${existingBoard.id}`;

    const inviteEmailContent = compileHtml(userSession.name, itemTitle, inviteLink);
    const receivers = value.users?.map((user: UserSearchType) => user?.email);

    sendEmail(receivers, `New ${inviteType} invitation`, inviteEmailContent);

    return generateNextResponse(`Successfully sent invitation emails to ${receivers.length} user(s)`);
}