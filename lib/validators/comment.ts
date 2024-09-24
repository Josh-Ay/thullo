const Joi = require("joi");

export const validateCommentDetails = (details = {}, isUpdate = false) => {
    const schema = isUpdate ? Joi.object({
        comment: Joi.string().required().min(1),
    }) : Joi.object({
        comment: Joi.string().required().min(1),
        cardId: Joi.string().required().min(36),
    })

    return schema.validate(details);
}
