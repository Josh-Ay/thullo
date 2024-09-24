interface BoardType {
    id?: string;
    title: string;
    description?: string;
    coverImage?: string;
    coverImageAuthor?: string;
    coverImageAuthorProfile?: string;
    visibility?: string;
    members?: BoardMemberType[];
    lists: ListType[];
    createdAt?: string;
    updatedAt?: string;
    creator?: UserType;
    creatorId: string;
}
