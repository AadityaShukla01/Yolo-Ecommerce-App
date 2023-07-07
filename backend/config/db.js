import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URL);

        console.log(`mongodb connect success : ${con.connection.host}`);

    } catch (error) {
        console.log(`Error : ${error.message}`);
    }
}

export default connectDB;