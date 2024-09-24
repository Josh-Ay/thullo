import { toast } from "sonner";

export class UserService {
    static readonly routePrefix: string = "/api/users";

    async searchUser(query: string): Promise<[]> {
        try {
            const res = await fetch(`${UserService.routePrefix}/search?query=${query}`, {
                method: 'GET',
            })

            const response = await res.json();

            const searchResults: [] = response?.data?.results;
            return searchResults;
        } catch (error) {
            throw Error(`${error}`)
        }
    }

    async sendInvite(inviteType: string, data = {}) {
        try {
            const res = await fetch(`${UserService.routePrefix}/invite/new?type=${inviteType}`, {
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
            throw Error(`${error}`)
        }
    }

    async acceptInvite(inviteId: string, inviteType: string, boardId: string) {
        try {
            const res = await fetch(`${UserService.routePrefix}/invite/join?type=${inviteType}&id=${inviteId}&boardId=${boardId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const jsonData = await res.json();

            if (!res.ok) {
                toast.error(jsonData?.message);
                throw Error(jsonData?.message);
            }

            toast.success(jsonData?.message);
        } catch (error: any) {
            throw Error(error?.message ?? 'An error occured while trying to accept this invite.\nPlease try again later')
        }
    }

    async getUserDetails(userId: string, host: string | null = null): Promise<UserProfileType> {
        try {
            const res = await fetch(
                host ?
                    `${host}${UserService.routePrefix}/user/${userId}?publicView=true`
                    :
                    `${UserService.routePrefix}/user/${userId}`,
                {
                    method: 'GET',
                }
            );

            const response = await res.json();

            if (!res.ok) {
                toast.error(response?.message);
                throw Error(response?.message);
            }

            const userDetail: UserProfileType = response?.data;
            return userDetail;
        } catch (error) {
            throw Error(`${error}`);
        }
    }

}