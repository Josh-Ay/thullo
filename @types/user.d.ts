interface UserType {
    id: string;
    name: string;
    email: string;
    oauthClientId: string;
    oauthProvider: string;
    profilePhoto: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

interface UserSearchType {
    id?: string;
    name: string;
    email: string;
    profilePhoto: string;
    image?: string;
}

interface ProfileStatDetails {
    boardsCreated: number;
    cards: number;
    comments: number;
}

interface UserProfileType {
    id: string;
    name: string;
    email: string;
    profilePhoto: string;
    createdAt: string;
    _count: ProfileStatDetails;
}

interface SearchResultFormatType {
    boards: BoardType[],
    lists: ListType[],
    cards: CardType[],
}

interface SavedUserInviteDetail {
    inviteType: string | null;
    item: string | null;
    boardId: string | null;
}