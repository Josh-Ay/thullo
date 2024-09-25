import { toast } from "sonner";

export class BoardService {
    static readonly routePrefix: string = "/api/boards";

    async fetchAllBoards(): Promise<BoardType[]> {
        try {
            const res = await fetch(`${BoardService.routePrefix}/all`, {
                method: 'GET',
            });

            const response = await res.json();

            const allBoards: BoardType[] = response?.data?.boards ?? [];
            return allBoards;
        } catch (error) {
            // console.log("Error fetching boards: ", error);
            return []
        }
    }

    async createNewBoard(data = {}): Promise<BoardType> {
        try {
            const res = await fetch(`${BoardService.routePrefix}/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const jsonData = await res.json();
            const newBoardData: BoardType = jsonData?.data;

            if (!res.ok) {
                toast.error(jsonData?.message);
                throw Error(jsonData?.message);
            }

            toast.success(jsonData?.message);

            return newBoardData;
        } catch (error) {
            throw Error(`${error}`);
        }
    }

    async getSingleBoardDetails(boardId: string, host: string | null = null): Promise<BoardType> {
        try {
            const res = await fetch(
                host ?
                    `${host}${BoardService.routePrefix}/board/${boardId}?view=public`
                    :
                    `${BoardService.routePrefix}/board/${boardId}`,
                {
                    method: 'GET',
                }
            );

            const response = await res.json();

            if (!res.ok) {
                toast.error(response?.message);
                throw Error(response?.message);
            }

            const boardDetail: BoardType = response?.data;
            return boardDetail;
        } catch (error) {
            throw Error(`${error}`);
        }
    }

    async updateSingleBoardDetails(boardId: string, data = {}): Promise<BoardType> {
        try {
            const res = await fetch(
                `${BoardService.routePrefix}/update/${boardId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            );

            const response = await res.json();

            if (!res.ok) {
                toast.error(response?.message);
                throw Error(response?.message);
            }

            const boardDetail: BoardType = response?.data;
            return boardDetail;
        } catch (error) {
            throw Error(`${error}`);
        }
    }

    async deleteBoardMember (data={}) {
        try {
            const res = await fetch(`${BoardService.routePrefix}/deleteMember`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const jsonData = await res.json();

            if (!res.ok) {
                toast.error(jsonData?.message);
                throw Error(jsonData?.message);
            }

            toast.success(jsonData?.message);
        } catch (error) {
            throw Error(`${error}`);
        }
    } 
}
