import { toast } from "sonner";

export class ListService {
    static readonly routePrefix: string = "/api/lists";

    async createNewList(data = {}): Promise<ListType> {
        try {
            const res = await fetch(`${ListService.routePrefix}/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const jsonData = await res.json();
            const newListData: ListType = jsonData?.data;

            if (!res.ok) {
                toast.error(jsonData?.message);
                throw Error(jsonData?.message);
            }

            toast.success(jsonData?.message);

            return newListData;
        } catch (error) {
            throw Error(`${error}`);
        }
    }

    async updateListDetail(listId: string, data = {}): Promise<ListType> {
        try {
            const res = await fetch(`${ListService.routePrefix}/edit/${listId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const jsonData = await res.json();
            const updatedListData: ListType = jsonData?.data;

            if (!res.ok) {
                toast.error(jsonData?.message);
                throw Error(jsonData?.message);
            }

            toast.success(jsonData?.message);

            return updatedListData;
        } catch (error) {
            throw Error(`${error}`);
        }
    }

    async updateListOrderInBoard(boardId: string, data = {}) {
        try {
            const res = await fetch(`${ListService.routePrefix}/update-list-order/${boardId}`, {
                method: 'PATCH',
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

    async deleteList(listId: string, data = {}) {
        try {
            const res = await fetch(`${ListService.routePrefix}/delete/${listId}`, {
                method: 'DELETE',
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