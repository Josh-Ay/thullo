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
}