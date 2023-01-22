import mongoose from "mongoose";

const MakeSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('w_make', MakeSchema)