export const defaultMetadata = {
    title: "Thullo - Trello Clone",
    description: "Thullo | Web Application Clone of Trello",
    authors: [
        {
            name: "Ayoola Oloyede",
            url: "https://github.com/Josh-Ay",
        }
    ]
}

export const formatDateAndTimeForApp = (date: string) => {
    if (date.length < 1) return '';

    const validDate = new Date(date);

    return `${validDate.getDate()} ${validDate.toLocaleString('en-us', { month: 'long' })}, ${validDate.getFullYear()}`
}

export const formatCommentDate = (date: string) => {
    if (date.length < 1) return '';

    const validDate = new Date(date);

    return `${validDate.getDate()} ${validDate.toLocaleString('en-us', { month: 'long' })} at ${validDate.toTimeString().split(' ')[0]?.slice(0, -3)}`
}

export enum AvailableAttachmentTypes {
    imageFile = "image",
    documentFile = "document",
}

export const convertFileObjectToBinaryStr = (fileObj: File): Promise<string | ArrayBuffer | null> => {

    // returning a new promise
    return new Promise((resolve, reject) => {
        // instantiating a new object of the FileReader class to read the file object passed
        const reader = new FileReader();

        // using the object to read the file as a data url i.e 'data:image/...'
        reader.readAsDataURL(fileObj);

        // on successful read of file
        reader.onload = () => resolve(reader.result);

        // on error reading the file
        reader.onerror = error => reject(error);
    });
}

export const extractWordInitialsInString = (inputStr: string) => {
    return inputStr.split(' ').map(word => word[0]).join('');
}

export const unsplashSiteLink = "https://unsplash.com/";

export const handleScrollToElement = (element: HTMLElement | null) => {
    element?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
    });
}

const savedInviteDetailDict = {
    inviteType: "INVITE_TYPE",
    item: "ITEM",
    board: "BOARD",
}

export const saveInviteDetailsToStorage = (inviteType: string, itemId: string, boardId: string) => {
    localStorage.setItem(savedInviteDetailDict.inviteType, inviteType);
    localStorage.setItem(savedInviteDetailDict.item, itemId);
    localStorage.setItem(savedInviteDetailDict.board, boardId);
}

export const getSavedInviteDetailsFromStorage = (): SavedUserInviteDetail | null => {
    const inviteDetails = {
        inviteType: localStorage.getItem(savedInviteDetailDict.inviteType),
        item: localStorage.getItem(savedInviteDetailDict.item),
        boardId: localStorage.getItem(savedInviteDetailDict.board),
    }

    if (!inviteDetails.inviteType || !inviteDetails.item || !inviteDetails.boardId) return null;

    return inviteDetails; 
}