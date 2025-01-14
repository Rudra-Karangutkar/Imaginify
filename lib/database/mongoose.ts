import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

// Extend the NodeJS.Global interface to include mongoose
declare global {
    namespace NodeJS {
        interface Global {
            mongoose: MongooseConnection | undefined;
        }
    }
}

// Use a cached global variable to prevent multiple connections in development
let cached: MongooseConnection = global.mongoose || { conn: null, promise: null };

if (!cached) {
    cached = { conn: null, promise: null };
    global.mongoose = cached;
}

export const connectToDatabase = async (): Promise<Mongoose> => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!MONGODB_URL) {
        throw new Error("Missing MONGODB_URL");
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URL, {
            dbName: "imaginify",
            bufferCommands: false,
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};
