import { getCurrentUserSession } from "@lib/auth";
import { validateImageDowloadRequest } from "@lib/validators/imageDownload";
import { generateNextResponse } from "@utils/responseGenerator";

export async function POST(req: Request) {
    const userSession = await getCurrentUserSession();
    if (!userSession) return generateNextResponse('You must be logged in to access this', 401);

    const data = await req.json();

    const { error, value } = validateImageDowloadRequest(data);
    if (error) return generateNextResponse(error.details[0]?.message, 400);

    try {
        await fetch(`${value.imageUrl}`, {
            headers: {
                'Accept-Version': 'v1',
                'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
            },
            method: 'GET',
        });

        return generateNextResponse('Successfully made download request for photo to unsplash!');

    } catch (error) {
        return generateNextResponse('An error occured while trying to make new download request for photo', 500);
    }
}