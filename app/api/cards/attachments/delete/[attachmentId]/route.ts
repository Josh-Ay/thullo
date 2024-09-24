import { getCurrentUserSession } from "@lib/auth";
import { prismaClient } from "@lib/prisma";
import { validateAttachmentDetails } from "@lib/validators/attachment";
import { generateNextResponse } from "@utils/responseGenerator";

export async function DELETE(
    req: Request,
    { params }: {
        params: {
            attachmentId: string,
        },
    },
) {
    const userSession = await getCurrentUserSession();
    if (!userSession) return generateNextResponse('You must be logged in to access this', 401);

    const { attachmentId } = params;
    if (!attachmentId) return generateNextResponse('Invalid request', 400);

    const data = await req.json();

    const { value, error } = validateAttachmentDetails(data, true);
    if (error) return generateNextResponse(error.details[0].message);

    try {
        const foundAttachment = await prismaClient.attachment.findFirst({
            where: {
                id: attachmentId,
            },
        });
        if (!foundAttachment) return generateNextResponse('Attachment details not found', 404);
        if (foundAttachment.creatorId !== userSession.userId) return generateNextResponse('You do not have permission to delete this attachment', 403);
    } catch (error) {
        return generateNextResponse('An error occured while trying to validate your request. Please try again later', 500);
    }

    try {
        await prismaClient.$transaction([
            prismaClient.attachment.delete({
                where: {
                    id: attachmentId,
                }
            }),
            prismaClient.card.update({
                where: {
                    id: value.cardId,
                },
                data: {
                    totalAttachments: {
                        decrement: 1,
                    },
                },
            }),
        ]);

        return generateNextResponse('Successfully deleted attachment detail', 200);
    } catch (error) {
        return generateNextResponse('An error occured while trying to validate your request. Please try again later', 500);
    }
}