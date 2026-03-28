import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = mongoose.model("User", new mongoose.Schema({}, { strict: false }));
        const user = await User.findOne({ roles: "mentor" }).lean();
        if (user) {
            console.log("Found mentor:", user.email);
            console.log(JSON.stringify(user, null, 2));
        } else {
            console.log("No mentor found in roles array. Checking single role field...");
            const user2 = await User.findOne({ role: "mentor" }).lean();
            if (user2) {
                console.log("Found mentor (single role):", user2.email);
               console.log(JSON.stringify(user2, null, 2));
            } else {
                console.log("No mentors found at all.");
            }
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
connectDB();
