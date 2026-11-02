import mongoose from 'mongoose';

let lastDbError = null;

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || process.env.MONGO_URI
        if (!uri) {
            console.error('MongoDB Error: MONGODB_URI (or MONGO_URI) is not set')
            lastDbError = 'MONGODB_URI (or MONGO_URI) is not set'
            return
        }
        const conn = await mongoose.connect(uri)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
        lastDbError = null
    }
    catch (error) {
        console.error(`MongoDB connection error: ${error.message}`)
        lastDbError = error.message
    }
}

export const getDbStatus = () => ({
    state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
    error: lastDbError
})

export default connectDB;
