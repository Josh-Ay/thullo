export enum ItemDragTypes {
    Card = "Card",
    List = "List",
    EmptyType = "",
}

type ItemDragType = ItemDragTypes.Card | ItemDragTypes.List | ItemDragTypes.EmptyType;

export interface CanvasListItemDragType {
    type: ItemDragType;
    item: ListType | null;
}

export interface CanvasCardItemDragType {
    type: ItemDragType;
    item: CardType | null;
}

export const initialDragItemActive = {
    type: ItemDragTypes.EmptyType,
    item: null,
}