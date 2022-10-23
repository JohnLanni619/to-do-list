import mongoose  from "mongoose"

const taskSchema = new mongoose.Schema({
    taskContent: {
        type: String,
    },
    // All categories will belong to a category which belongs to a user
    categoryId: {type: mongoose.SchemaTypes.ObjectId, ref: 'Category'},
    isCompleted: {type: Boolean, default: false},
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
})

export const Task = mongoose.model('Task', taskSchema)