import mongoose from "mongoose";

interface Options {
    mongo_uri: string
}

export class MongoDatabase {
    private readonly mongo_uri: string;

    constructor(options: Options) {
        this.mongo_uri = options.mongo_uri;
    }

    async connect() {
        await mongoose.connect(this.mongo_uri, );
        console.log('MongoDB connected');
    }

    async disconnect() {
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
    }
}
