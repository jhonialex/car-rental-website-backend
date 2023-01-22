import mongoose from "mongoose"

const databaseConnection = () => {
    try {
        mongoose.connect(`${process.env.MONGO_URI}`)
    } catch (e) {
        console.log('Not possible to connect to database')
    }
}

export { databaseConnection }