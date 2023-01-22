import joi from 'joi'

const CreateCarValidation = joi.object({
    name: joi.string().min(2).max(512).required(),
    descriptionItems: joi.string().required(),
    dailyPrice: joi.string(),
    model: joi.string().min(2).max(512).required(),
    make: joi.string().min(2).max(512).required(),
    bodyStyle: joi.string().min(2).max(512).required(),
    exteriorColor: joi.string().min(2).max(512).required(),
    interiorColor: joi.string().min(2).max(512).required(),
    engine: joi.string().min(2).max(512).required(),
    transmission: joi.string().min(2).max(512).required(),
    mileage: joi.string().min(2).max(512).required(),
    vin: joi.string().min(2).max(512).required(),
})

const UpdateCarValidation = joi.object({
    id: joi.string().required(),
    name: joi.string().min(2).max(512).required(),
    descriptionItems: joi.string().required(),
    dailyPrice: joi.string(),
    model: joi.string().min(2).max(512).required(),
    make: joi.string().min(2).max(512).required(),
    bodyStyle: joi.string().min(2).max(512).required(),
    exteriorColor: joi.string().min(2).max(512).required(),
    interiorColor: joi.string().min(2).max(512).required(),
    engine: joi.string().min(2).max(512).required(),
    transmission: joi.string().min(2).max(512).required(),
    mileage: joi.string().min(2).max(512).required(),
    vin: joi.string().min(2).max(512).required(),
})

const DeleteCarValidation = joi.object({
    id: joi.string().required(),
})

const GetCarsValidation = joi.object({
    model: joi.string().min(2).max(512),
    make: joi.string().min(2).max(512),
    bodyStyle: joi.string().min(2).max(512),
})

const GetSingleCarValidation = joi.object({
    slug: joi.string().required(),
})

export { CreateCarValidation, UpdateCarValidation, DeleteCarValidation, GetCarsValidation, GetSingleCarValidation }