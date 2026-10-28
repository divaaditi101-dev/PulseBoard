import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || process.env.MONGO_URI
        if (!uri) {
            throw new Error('MONGODB_URI (or MONGO_URI) is not set')
        }
        const conn = await mongoose.connect(uri)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }
    catch (error) {
        console.log(`MongoDB connection error: ${error.message}`)
        process.exit(1)
    }
}
export default connectDB;
