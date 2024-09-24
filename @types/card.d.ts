interface CardType {
    id: string;
    title: string;
    description?: string;
    cardIndex: number;
    totalComments: number;
    totalAttachments: number;
    coverImage?: string;
    coverImageAuthor?: string;
    coverImageAuthorProfile?: string;
    listId: string;
    creatorId: string;
    labels?: CardLabelType[];
    attachments?: AttachmentType[];
    comments?: CommentType[];
    members?: CardMemberType[];
    createdAt?: string;
    updatedAt?: string;
}
