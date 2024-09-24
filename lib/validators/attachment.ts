import { AvailableAttachmentTypes } from "@utils/utils";

const Joi = require("joi");


export const validateAttachmentDetails = (details = {}, isDelete = false,) => {
    const schema = isDelete ? Joi.object({
        cardId: Joi.string().required().min(36),
    }) : Joi.object({
        name: Joi.string().required().min(1),
        attachmentFile: Joi.string().required(),
        fileExtension: Joi.string().required(),
        fileType: Joi.string().required().valid(AvailableAttachmentTypes.imageFile, AvailableAttachmentTypes.documentFile),
        cardId: Joi.string().required().min(36),
    })

    return schema.validate(details);
}