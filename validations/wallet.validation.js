const Joi = require('joi')
const { handleValidationError } = require("../utils/error")

exports.validateFund = async (req, res, next) => {
    const schema = Joi.object().keys({
        amount: Joi.number().label("Amount")
    })

    await handleValidationError(req, res, next, schema.validate(req.body))
}

exports.validateWithdrawal = async (req, res, next) => {
    const schema = Joi.object().keys({
        amount: Joi.number().label("Amount")
    })

    await handleValidationError(req, res, next, schema.validate(req.body))
}

exports.validateTransfer = async (req, res, next) => {
    const schema = Joi.object().keys({
        email: Joi.string().required().label("Receiver Email"),
        amount: Joi.number().label("Amount")
    })

    await handleValidationError(req, res, next, schema.validate(req.body))
}