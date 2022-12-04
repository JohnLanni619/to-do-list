import mongoose from 'mongoose';

export async function connectDb() {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING)

        // Confirm connection
        console.log("🗃 Connected to DB Success");

    } catch (error) {
        console.error(error);
        // If there's an issue, close connection to db
        await mongoose.connection.close()
    }
}