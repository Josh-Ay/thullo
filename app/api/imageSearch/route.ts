import { getCurrentUserSession } from "@lib/auth";
import { generateNextResponse } from "@utils/responseGenerator";

export async function GET(req: Request) {
    const userSession = await getCurrentUserSession();
    if (!userSession) return generateNextResponse('You must be logged in to access this', 401);

    const params = new URLSearchParams(req.url.split('/api/imageSearch')[1]);

    const searchQuery = params.get('query');
    if (!searchQuery) return generateNextResponse("'query' missing in search params", 400);

    try {
        const res = await fetch(`https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=50`, {
            headers: {
                'Accept-Version': 'v1',
                'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
            }
        });
        const data = await res.json();

        return generateNextResponse('Successfully fetched results for your query', 200, {
            results: data?.results,
        });

    } catch (error) {
        return generateNextResponse('An error occured while trying to search for your photo', 500);
    }
}