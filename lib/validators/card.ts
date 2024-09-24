const Joi = require("joi");


export const validateCardDetails = (cardDetails = {}) => {
    const schema = Joi.object({
        title: Joi.string().required().min(1),
        coverImage: Joi.string().min(0),
        coverImageAuthor: Joi.string().min(0),
        coverImageAuthorProfile: Joi.string().min(0),
        description: Joi.string().min(0),
        listId: Joi.string().required().min(36),
    })

    return schema.validate(cardDetails);
}

export const validateCardListOrderDetail = (details = {}) => {
    const schema = Joi.object({
        boardId: Joi.string().required().min(36),
        cards: Joi.array().items(
            Joi.object().keys({
                id: Joi.string().required().min(36),
                cardIndex: Joi.number().required(),
                listId: Joi.string().required().min(36),
            })
        )
    })

    return schema.validate(details);
}

export const validateCardLabelDetail = (details = {}) => {
    const schema = Joi.object({
        name: Joi.string().required().min(1),
        color: Joi.string().required().min(1),
        cardId: Joi.string().required().min(36),
    });

    return schema.validate(details);
}

export interface CardListOrderUpdateType {
    id: string;
    cardIndex: number;
    listId: string;
}