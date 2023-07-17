const { Joi, celebrate} = require("celebrate");
const validator = require("validator");


// Function to validate URL
const validateURL = (value, helpers) => {
    if (!validator.isURL(value)) {
        return helpers.message({
            custom: 'The "imageUrl" field must be a valid URL',
        });
    }
    return value;
};

// Validation function for creating a clothing item
module.exports.validateCardBody = celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30).messages({
            "string.min": 'The minimum length of the "name" field is 2',
            "string.max": 'The maximum length of the "name" field is 30',
            "string.empty": 'The "name" field must be filled in',
        }),
        imageUrl: Joi.string().required().custom(validateURL).messages({
            "string.empty": 'The "imageUrl" field must be filled in',
            "string.uri": 'The "imageUrl" field must be a valid url',
        }),
        weather: Joi.string().required().messages({
            "string.empty": 'The "weather" field must be filled in',
        }),
    }),
});


// Validation function for clothing item's id
module.exports.validateId = celebrate({
    params: Joi.object().keys({
        itemId: Joi.string()
            .length(24)
            .hex()
            .required()
            .messages({
                "string.length": 'The "itemId" field must be 24 characters long',
                "string.hex": 'The "itemId" field must be a hexadecimal value',
                "string.empty": 'The "itemId" field must be filled in',
            }),
    }),
});

// Function to validate user creation
module.exports.validateUserBody = celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30).messages({
            "string.min": 'The minimum length of the "name" field is 2',
            "string.max": 'The maximum length of the "name" field is 30',
            "string.empty": 'The "name" field must be filled in',
        }),
        avatar: Joi.string().required().custom(validateURL).messages({
            "string.empty": 'The "avatar" field must be filled in',
            "string.uri": 'The "avatar" field must be a valid url',
        }),
        email: Joi.string().email().required().messages({
            "string.email": 'The "email" field must be a valid email',
            "string.empty": 'The "email" field must be filled in',
        }),
        password: Joi.string()
        .required()
        .messages({
            'any.required': 'The "password" field must be filled in',
        }),
    }),
    
});

// Function to validate user authentication
module.exports.validateAuthBody = celebrate({
    body: Joi.object().keys({
        email: Joi.string().email().required().messages({
            "string.email": 'The "email" field must be a valid email',
            "string.empty": 'The "email" field must be filled in',
        }),
        password: Joi.string()
            .required()
            .messages({
                'any.required': 'The "password" field must be filled in',
            }),
    }),
});

// Function to validate user update
module.exports.validateUpdateUserBody = celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30).optional().messages({
            "string.min": 'The minimum length of the "name" field is 2',
            "string.max": 'The maximum length of the "name" field is 30',
            "string.empty": 'The "name" field must be filled in',
        }),
        avatar: Joi.string().optional().custom(validateURL).messages({
            "string.empty": 'The "avatar" field must be filled in',
            "string.uri": 'The "avatar" field must be a valid url',
        }),
    }),
});
