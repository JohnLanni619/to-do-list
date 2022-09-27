import mongoose  from "mongoose"

const sessionSchema = new mongoose.Schema({
    sessionToken: String,
    userId: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
    valid: Boolean,
    userAgent: String,
    ip: String,
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
})

export const Session = mongoose.model('Session', sessionSchema)
