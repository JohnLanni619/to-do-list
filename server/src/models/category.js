import mongoose  from "mongoose"

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
    },
    // All categories will belong to the user who created it
    userId: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
    tasks: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Task'
    }],
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
})

export const Category = mongoose.model('Category', categorySchema)