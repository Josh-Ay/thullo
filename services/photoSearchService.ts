export class PhotoSearchService {
    static readonly routePrefix: string = "/api/imageSearch";

    async searchImageOnUnsplash(query: string): Promise<[]> {
        try {
            const res = await fetch(`${PhotoSearchService.routePrefix}?query=${query}`, {
                method: 'GET',
            })

            const response = await res.json();

            const searchResults: [] = response?.data?.results;
            return searchResults;
        } catch (error) {
            throw Error(`${error}`)
        }
    }

    async makeDownloadRequestToUnsplash(data={}) {
        try {
            const res = await fetch(`${PhotoSearchService.routePrefix}/download`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const jsonData = await res.json();

            if (!res.ok) {
                throw Error(jsonData?.message);
            }
            
        } catch (error) {
            throw Error(`${error}`);
        }
    }
}