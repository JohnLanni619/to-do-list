import mongoose from 'mongoose';

const url = `mongodb+srv://johnlanni:bKMvK9LUpj6PbRHL@cluster0.e7sya0i.mongodb.net/to-do?retryWrites=true&w=majority`;

export async function connectDb() {
    try {
        await mongoose.connect(url)

        // Confirm connection
        console.log("🗃 Connected to DB Success");

    } catch (error) {
        console.error(error);
        // If there's an issue, close connection to db
        await mongoose.connection.close()
    }
}