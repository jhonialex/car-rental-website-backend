import joi from 'joi'

const LoginValidation = joi.object({
    username: joi.string().min(4).max(256).required(),
    password: joi.string().min(6).max(256).required()
})

const RefreshValidation = joi.object({
    refreshToken: joi.string().required(),
})

export { LoginValidation, RefreshValidation }