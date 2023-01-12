const Joi = require('joi')
const { handleValidationError } = require("../utils/error")

exports.validateSignUp = async (req, res, next) => {
    const schema = Joi.object().keys({
        firstName: Joi.string().required().label(" First Name"),
        lastName: Joi.string().required().label(" Last Name"),
        email: Joi.string().required().label("Email"),
        phoneNumber: Joi.string().required().label("Phone Number"),
        password: Joi.string().required().label("Password")
    })

    await handleValidationError(req, res, next, schema.validate(req.body))
}

exports.validateLogin = async (req, res, next) => {
    const schema = Joi.object().keys({
        email: Joi.string().required().label("Email"),
        password: Joi.string().required().label("Password")
    })

    await handleValidationError(req, res, next, schema.validate(req.body))
}