import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email: {
        address: {type: String, unique: true }, 
        verified: Boolean
    },
    password: String,
    categories: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Category'
    }]
})

export const User = mongoose.model('User', userSchema)