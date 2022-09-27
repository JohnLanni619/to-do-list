import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email: {
        address: String, 
        verified: Boolean
    },
    password: String
})

export const User = mongoose.model('User', userSchema)