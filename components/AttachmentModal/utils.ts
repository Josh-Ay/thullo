import { AvailableAttachmentTypes } from "@utils/utils"

enum AllowedFileUnits {
    GB = 'GB',
    MB = 'MB',
    KB = 'KB',
}

export const maximumFileSizeDetails = {
    size: 1,
    unit: AllowedFileUnits.MB,
};

export const getFileSizeInUnit = (sizeInBytes: number, unit: AllowedFileUnits) => {
    switch (unit) {
        case AllowedFileUnits.KB:
            return sizeInBytes / 1024;

        case AllowedFileUnits.MB:
            return sizeInBytes / 1024 / 1024;

        case AllowedFileUnits.GB:
            return sizeInBytes / 1024 / 1024;

        default:
            throw Error("'unit' must be one of the defined units in 'AllowedFileUnits'");
    }
}

export const initialDetails = {
    name: "",
    fileType: "",
    file: null,
    filePreview: "",
    fileExtension: "",
}

export const availableFileTypes = [
    {
        title: AvailableAttachmentTypes.imageFile,
        fileExtension: "image/*",
    },
    {
        title: AvailableAttachmentTypes.documentFile,
        fileExtension: ".pdf, .txt, .doc, .docx",
    },
]
