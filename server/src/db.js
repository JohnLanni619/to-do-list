import mongo from 'mongodb';
const { MongoClient } = mongo;

const url = process.env.MONGO_URL;

export const client = new MongoClient(url, { useNewUrlParser: true });

export async function connectDb() {
    try {
        await client.connect()

        // Confirm connection
        await client.db("admin").command({ ping: 1 })
        console.log("🗃 Connected to DB Success");
    } catch (error) {
        console.error(error);
        // If there's an issue, close connection to db
        await client.close()
    }
}