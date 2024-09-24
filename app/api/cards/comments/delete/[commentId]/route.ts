import { getCurrentUserSession } from "@lib/auth";
import { prismaClient } from "@lib/prisma";
import { generateNextResponse } from "@utils/responseGenerator";

export async function DELETE(
    req: Request,
    { params }: {
        params: {
            commentId: string,
        }
    },
) {
    const { commentId } = params;
    if (!commentId) return generateNextResponse('Invalid request', 400);

    const userSession = await getCurrentUserSession();
    if (!userSession) return generateNextResponse('You must be logged in to access this', 401);

    try {
        const foundComment = await prismaClient.comment.findFirst({
            where: {
                id: commentId,
            },
        });
        if (!foundComment) return generateNextResponse('Comment not found', 404);
        if (foundComment.authorId !== userSession.userId) return generateNextResponse('You do not have permission to edit this comment', 403);
    } catch (error) {
        return generateNextResponse('An error occurred while trying to delete your comment', 500);
    }

    try {
        await prismaClient.comment.delete({
            where: {
                id: commentId,
            },
        });

        return generateNextResponse('Successfully deleted comment!');
    } catch (error) {
        return generateNextResponse('An error occurred while trying to delete your comment', 500);
    }
}