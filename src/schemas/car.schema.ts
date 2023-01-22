import mongoose from "mongoose";

const CarSchema = new mongoose.Schema({
    slug: {
        type: String,
        index: true,
    },
    model: {
        type: String,
        index: true,
    },
    make: {
        type: String,
        index: true,
    },
    bodyStyle: {
        type: String,
        index: true,
    },
    name: String,
    image: String,
    dailyPrice: Number,
    images: [String],
    descriptionItems: [String],
    specs: {
        exteriorColor: String,
        interiorColor: String,
        engine: String,
        transmission: String,
        mileage: Number,
        vin: String,
    },
    available: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('w_car', CarSchema)