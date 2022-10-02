import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email: {
        address: {type: String, unique: true }, 
        verified: Boolean
    },
    password: String
})

export const User = mongoose.model('User', userSchema)