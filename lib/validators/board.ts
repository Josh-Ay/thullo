const Joi = require("joi");


export const validateBoardDetails = (boardDetails = {}, isUpdate = false) => {
    const schema = isUpdate ? Joi.object({
        title: Joi.string().required().min(1),
        description: Joi.string().min(0),
        visibility: Joi.string().required().valid('private', 'public'),
    })
        :
        Joi.object({
            title: Joi.string().required().min(1),
            coverImage: Joi.string().required().min(1),
            coverImageAuthor: Joi.string().required().min(0),
            coverImageAuthorProfile: Joi.string().required().min(0),
            description: Joi.string().min(0),
            visibility: Joi.string().required().valid('private', 'public'),
        })

    return schema.validate(boardDetails);
}