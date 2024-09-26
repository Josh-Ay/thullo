const Joi = require("joi");

export const validateImageDowloadRequest = (details = {}) => {
    const schema = Joi.object({
        imageUrl: Joi.string().required().min(1),
    })

    return schema.validate(details);
}
