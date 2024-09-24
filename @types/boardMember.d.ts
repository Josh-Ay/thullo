interface BoardMemberType {
    id?: string;
    boardId: string;
    userId: string;
    user: UserType;
    createdAt?: string;
    updatedAt?: string;
}