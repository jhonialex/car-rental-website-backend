import { Request, Response } from "express";
import bodyStyleSchema from "../schemas/bodyStyle.schema";
import makeSchema from "../schemas/make.schema";
import modelSchema from "../schemas/model.schema";

// get database models, makes and body styles
async function getDataController(req: Request, res: Response) {
    try {

        const models = await modelSchema.find({}).sort({ createdAt: -1 }).lean().exec()
        const makes = await makeSchema.find({}).sort({ createdAt: -1 }).lean().exec()
        const bodyStyles = await bodyStyleSchema.find({}).sort({ createdAt: -1 }).lean().exec()

        return res.status(200).send({ models, makes, bodyStyles })

    } catch (err) {
        return res.status(500).send({ message: 'Not possible to get data' })
    }
}

export { getDataController }