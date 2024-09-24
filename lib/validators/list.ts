const Joi = require("joi");


export const validateListDetails = (listDetails = {}, { isUpdate = false, isDelete=false } = {}) => {
    const schema = isDelete ? Joi.object({
        boardId: Joi.string().required().min(36),
    }) : Joi.object({
        title: Joi.string().required().min(1),
        boardId: Joi.string().required().min(36),
    })

    return schema.validate(listDetails);
}

export const validateListOrderDetails = (details={}) => {
    const schema = Joi.object({
        lists: Joi.array().items(
            Joi.object().keys({
                id: Joi.string().required().min(36),
                listIndex: Joi.number().required(),
            })
        )
    })

    return schema.validate(details);
}

export interface ListOrderItemUpdateType {
    id: string;
    listIndex: number;
}