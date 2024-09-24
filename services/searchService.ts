export class SearchService {
    static readonly routePrefix: string = "/api/search";

    async searchApp(query: string): Promise<SearchResultFormatType> {
        try {
            const res = await fetch(`${SearchService.routePrefix}?query=${query}`, {
                method: 'GET',
            })

            const response = await res.json();

            const searchResults: SearchResultFormatType = response?.data?.results;
            return searchResults;
        } catch (error) {
            throw Error(`${error}`)
        }
    }
}