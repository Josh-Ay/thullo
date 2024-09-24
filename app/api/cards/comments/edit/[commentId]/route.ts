import { getCurrentUserSession } from "@lib/auth";
import { prismaClient } from "@lib/prisma";
import { validateCommentDetails } from "@lib/validators/comment";
import { generateNextResponse } from "@utils/responseGenerator";

export async function PATCH(
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

    const data = await req.json();

    const { value, error } = validateCommentDetails(data, true);
    if (error) return generateNextResponse(error.details[0]?.message, 400);

    try {
        const foundComment = await prismaClient.comment.findFirst({
            where: {
                id: commentId,
            },
        });
        if (!foundComment) return generateNextResponse('Comment not found', 404);
        if (foundComment.authorId !== userSession.userId) return generateNextResponse('You do not have permission to edit this comment', 403);
    } catch (error) {
        return generateNextResponse('An error occurred while trying to update your comment', 500);
    }

    try {
        const updatedComment = await prismaClient.comment.update({
            where: {
                id: commentId,
            },
            data: {
                comment: value.comment
            },
        });

        return generateNextResponse('Successfully updated comment details!', 200, {
            ...updatedComment,
        });
    } catch (error) {
        return generateNextResponse('An error occurred while trying to update your comment', 500);
    }
}