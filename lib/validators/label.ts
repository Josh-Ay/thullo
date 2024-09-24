const Joi = require("joi");


export const validateLabelDetails = (labelDetails = {}) => {
    const schema = Joi.object({
        name: Joi.string().required().min(1),
        color: Joi.string().min(0),
        listId: Joi.string().required().min(36),
    })

    return schema.validate(labelDetails);
}
