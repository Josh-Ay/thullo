import { toast } from "sonner";

export class CardService {
    static readonly routePrefix: string = "/api/cards";

    async createNewCard(data = {}): Promise<CardType> {
        try {
            const res = await fetch(`${CardService.routePrefix}/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const jsonData = await res.json();
            const newCardData: CardType = jsonData?.data;

            if (!res.ok) {
                toast.error(jsonData?.message);
                throw Error(jsonData?.message);
            }

            toast.success(jsonData?.message);

            return newCardData;
        } catch (error) {
            throw Error(`${error}`);
        }
    }

    async updateCardsOrderInList(data = {}) {
        try {
            const res = await fetch(`${CardService.routePrefix}/edit/list-order`, {
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
        } catch (error) {
            throw Error(`${error}`);
        }

    }

    async updateSingleCardDetails(cardId: string, data = {}): Promise<CardType> {
        try {
            const res = await fetch(`${CardService.routePrefix}/edit/card/${cardId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const jsonData = await res.json();
            const updatedCardData: CardType = jsonData?.data;

            if (!res.ok) {
                toast.error(jsonData?.message);
                throw Error(jsonData?.message);
            }

            toast.success(jsonData?.message);

            return updatedCardData;
        } catch (error) {
            throw Error(`${error}`);
        }
    }

    async addNewCardLabel(cardId: string, data = {}): Promise<CardLabelType> {
        try {
            const res = await fetch(`${CardService.routePrefix}/edit/label/${cardId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const jsonData = await res.json();
            const labelData: CardLabelType = jsonData?.data;

            if (!res.ok) {
                toast.error(jsonData?.message);
                throw Error(jsonData?.message);
            }

            toast.success(jsonData?.message);

            return labelData;
        } catch (error) {
            throw Error(`${error}`);
        }
    }

    async addNewCardComment(data = {}): Promise<CommentType> {
        try {
            const res = await fetch(`${CardService.routePrefix}/comments/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const jsonData = await res.json();
            const commentData: CommentType = jsonData?.data;

            if (!res.ok) {
                toast.error(jsonData?.message);
                throw Error(jsonData?.message);
            }

            return commentData;
        } catch (error) {
            throw Error(`${error}`);
        }
    }

    async updateCardComment(commentId: string, data = {}): Promise<CommentType> {
        try {
            const res = await fetch(`${CardService.routePrefix}/comments/edit/${commentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const jsonData = await res.json();
            const commentData: CommentType = jsonData?.data;

            if (!res.ok) {
                toast.error(jsonData?.message);
                throw Error(jsonData?.message);
            }

            return commentData;
        } catch (error) {
            throw Error(`${error}`);
        }
    }

    async deleteComment(commentId: string) {
        try {
            const res = await fetch(`${CardService.routePrefix}/comments/delete/${commentId}`, {
                method: 'DELETE',
            });

            const jsonData = await res.json();

            if (!res.ok) {
                toast.error(jsonData?.message);
                throw Error(jsonData?.message);
            }
        } catch (error) {
            throw Error(`${error}`);
        }
    }

    async getAllCardComments(cardId: string): Promise<CommentType[]> {
        try {
            const res = await fetch(`${CardService.routePrefix}/comments/all/${cardId}`, {
                method: 'GET',
            });

            const jsonData = await res.json();
            const commentData: CommentType[] = jsonData?.data?.comments;

            if (!res.ok) {
                toast.error(jsonData?.message);
                throw Error(jsonData?.message);
            }

            return commentData;
        } catch (error) {
            throw Error(`${error}`);
        }
    }

    async addNewCardAttachment(data = {}): Promise<AttachmentType> {
        try {
            const res = await fetch(`${CardService.routePrefix}/attachments/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const jsonData = await res.json();
            const attachmentData: AttachmentType = jsonData?.data;

            if (!res.ok) {
                toast.error(jsonData?.message);
                throw Error(jsonData?.message);
            }

            toast.success(jsonData?.message);

            return attachmentData;
        } catch (error) {
            throw Error(`${error}`);
        }
    }

    async getAllCardAttachments(cardId: string): Promise<AttachmentType[]> {
        try {
            const res = await fetch(`${CardService.routePrefix}/attachments/all/${cardId}`, {
                method: 'GET',
            });

            const jsonData = await res.json();
            const attachmentData: AttachmentType[] = jsonData?.data?.attachments;

            if (!res.ok) {
                toast.error(jsonData?.message);
                throw Error(jsonData?.message);
            }

            return attachmentData;
        } catch (error) {
            throw Error(`${error}`);
        }
    }

    async deleteCardAttachment(attachmentId: string, data={}) {
        try {
            const res = await fetch(`${CardService.routePrefix}/attachments/delete/${attachmentId}`, {
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