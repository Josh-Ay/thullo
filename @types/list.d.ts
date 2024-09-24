interface ListType {
    id: string;
    title: string;
    creatorId: string;
    boardId: string;
    listIndex: number;
    cards: CardType[];
    createdAt: string;
    updatedAt: string;
}