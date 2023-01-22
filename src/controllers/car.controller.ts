import { Request, Response } from "express";
import slugify from 'limax'
import bodyStyleSchema from "../schemas/bodyStyle.schema";
import carSchema from "../schemas/car.schema";
import makeSchema from "../schemas/make.schema";
import modelSchema from "../schemas/model.schema";
import { CreateCarValidation, DeleteCarValidation, GetCarsValidation, GetSingleCarValidation, UpdateCarValidation } from "../utils/validations/car.validations";
import { uploadImage } from "../utils/handlers/image.handler";

type CreateCarType = {
    name: string,
    descriptionItems: string,
    dailyPrice: string,
    model: string,
    make: string,
    bodyStyle: string,
    exteriorColor: string,
    interiorColor: string,
    engine: string,
    transmission: string,
    mileage: string,
    vin: string
}

type UpdateCarType = {
    id: string,
    name: string,
    descriptionItems: string,
    dailyPrice: string,
    model: string,
    make: string,
    image: string,
    images: [String],
    bodyStyle: string,
    exteriorColor: string,
    interiorColor: string,
    engine: string,
    transmission: string,
    mileage: string,
    vin: string
}

const removeNullUndefined = (obj: {}) => Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));

async function handleImages(images: Express.Multer.File[], id: string, oldImages: [] | [string]) {

    let urls: string[] = [...oldImages]
    for (const i of images) {
        const url = await uploadImage(i.buffer)
        if (url) urls.push(url)
    }

    await carSchema.findOneAndUpdate({ _id: id }, { images: urls, available: true }).lean().exec()

}

// check if model, make, bodyStyle already exist, if not, create.
async function handleData(data: { model: string, make: string, bodyStyle: string }) {

    const model = await modelSchema.findOne({ name: data.model }).lean().exec()
    if (!model) await modelSchema.create({ name: data.model })

    const make = await makeSchema.findOne({ name: data.make }).lean().exec()
    if (!make) await makeSchema.create({ name: data.make })

    const bodyStyle = await bodyStyleSchema.findOne({ name: data.bodyStyle }).lean().exec()
    if (!bodyStyle) await bodyStyleSchema.create({ name: data.bodyStyle })

}

// create car
async function createCarController(req: Request, res: Response) {
    try {

        const { error, value } = CreateCarValidation.validate(req.body)
        if (error) return res.status(400).send({ message: 'Invalid fields values' })
        if (!req?.files) return res.status(400).send({ message: 'No images were uploaded' })

        const files: { [fieldname: string]: Express.Multer.File[] } = req.files as { [fieldname: string]: Express.Multer.File[] }
        if (!files['image']) return res.status(400).send({ message: 'No main image uploaded' })
        if (!files['images']) return res.status(400).send({ message: 'No images were uploaded' })

        const data: CreateCarType = value
        const image = await uploadImage(files['image'][0].buffer)

        let params = removeNullUndefined({
            name: data.name,
            slug: slugify(data.name),
            image,
            descriptionItems: Array.from(JSON.parse(data.descriptionItems)),
            dailyPrice: Number(data.dailyPrice),
            model: data.model,
            make: data.make,
            bodyStyle: data.bodyStyle,
            specs: {
                exteriorColor: data.exteriorColor,
                interiorColor: data.interiorColor,
                engine: data.engine,
                transmission: data.transmission,
                mileage: Number(data.mileage),
                vin: data.vin
            },
            available: false
        })

        const car = await carSchema.create(params)
        if (!car) return res.status(500).send({ message: 'Not possible to create car' })

        await handleData({ model: data.model, make: data.make, bodyStyle: data.bodyStyle })

        handleImages(files['images'], car._id.toString(), [])

        return res.status(200).send({ message: 'Car is being created' })

    } catch (err) {
        return res.status(500).send({ message: 'Not possible to create car' })
    }
}

// update car
async function updateCarController(req: Request, res: Response) {
    try {

        const { error, value } = UpdateCarValidation.validate(req.body)
        if (error) return res.status(400).send({ message: 'Invalid fields values' })

        let data: UpdateCarType = value

        let mainImage = null
        let updatedImages: Express.Multer.File[] = []

        if (req?.files) {
            const files: { [fieldname: string]: Express.Multer.File[] } = req.files as { [fieldname: string]: Express.Multer.File[] }
            if (files['image']) {
                mainImage = await uploadImage(files['image'][0].buffer)
            }
            if (files['images']) {
                updatedImages = files['images']
            }
        }

        if (mainImage) data.image = mainImage

        const updated = await carSchema.findOneAndUpdate({ _id: data.id }, data).lean().exec()
        if (!updated) return res.status(500).send({ message: 'Not possible to update car' })

        if (updatedImages.length > 0) handleImages(updatedImages, updated._id.toString(), [])

        return res.status(200).send({ message: 'Car is being updated' })

    } catch (err) {
        return res.status(500).send({ message: 'Not possible to update car' })
    }
}

// delete car
async function deleteCarController(req: Request, res: Response) {
    try {

        const { error, value } = DeleteCarValidation.validate(req.body)
        if (error) return res.status(400).send({ message: 'Invalid fields values' })

        const data: { id: string } = value

        const deletion = await carSchema.findOneAndDelete({ _id: data.id }).lean().exec()
        if (!deletion) return res.status(500).send({ message: 'Not possible to delete car' })

        return res.status(200).send({ message: 'Car deleted' })

    } catch (err) {
        return res.status(500).send({ message: 'Not possible to delete car' })
    }
}

// get cars
async function getCarsController(req: Request, res: Response) {
    try {

        const { error, value } = GetCarsValidation.validate(req.body)
        if (error) return res.status(400).send({ message: 'Invalid fields values' })

        const data: { model?: string, bodyStyle?: string, make?: string } = value

        const query = removeNullUndefined({ model: data.model, bodyStyle: data.bodyStyle, make: data.make })
        const cars = await carSchema.find(query).sort({ createdAt: -1 }).lean().exec()

        return res.status(200).send({ cars })

    } catch (err) {
        return res.status(500).send({ message: 'Not possible to create car' })
    }
}

// get single car
async function getSingleCarController(req: Request, res: Response) {
    try {

        const { error, value } = GetSingleCarValidation.validate(req.params)
        if (error) return res.status(400).send({ message: 'Invalid fields values' })

        const data: { id: string } = value

        const car = await carSchema.findOne({ _id: data.id }).lean().exec()
        if (!car) return res.status(500).send({ message: 'Not possible to delete car' })

        return res.status(200).send({ car })


    } catch (err) {
        return res.status(500).send({ message: 'Not possible to create car' })
    }
}

export { createCarController, updateCarController, deleteCarController, getCarsController, getSingleCarController }