interface CommentType {
    id: string;
    author: UserType;
    authorId: string;
    comment: string;
    cardId: string;
    createdAt: string;
    updatedAt?: string;
}