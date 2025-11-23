import mongoose from "mongoose";


const connectDB = async () =>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/Campus-Connect-db?retryWrites=true&w=majority&appName=CampusConnect`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED", error);
        process.exit(1)
    }
}

export default connectDB