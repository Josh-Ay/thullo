const Joi = require("joi");

export enum ValidInviteTypes {
    boardInvite = 'board',
    cardInvite = 'card',
}

export const validInviteTypesList = [
    ValidInviteTypes.boardInvite,
    ValidInviteTypes.cardInvite,
]

export const validateInviteDetails = (details = {}, inviteType: ValidInviteTypes) => {
    const schema = inviteType === ValidInviteTypes.cardInvite ? Joi.object({
        users: Joi.array().items(
            Joi.object().keys({
                name: Joi.string().required(),
                email: Joi.string().email({ minDomainSegments: 2 }).required(),
                profilePhoto: Joi.string(),
            }),
        ),
        cardId: Joi.string().required().min(36),
        boardId: Joi.string().required().min(36),
    }) : inviteType === ValidInviteTypes.boardInvite ? Joi.object({
        users: Joi.array().items(
            Joi.object().keys({
                name: Joi.string().required(),
                email: Joi.string().email({ minDomainSegments: 2 }).required(),
                profilePhoto: Joi.string(),
            }),
        ),
        boardId: Joi.string().required().min(36),
    }) : Joi.object({});

    return schema.validate(details);
}