interface AttachmentType {
    id: string;
    name: string;
    attachmentFile: string;
    fileExtension: string;
    fileType: string;
    creatorId: string;
    cardId: string;
    createdAt: string;
    updatedAt?: string;
}