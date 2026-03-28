import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = mongoose.model("User", new mongoose.Schema({}, { strict: false }));
        const Mentor = mongoose.model("Mentor", new mongoose.Schema({}, { strict: false }));
        
        const user = await User.findOne({ 
            $or: [
                { email: /hassan.raza/i },
                { "profile.displayName": /hassan.raza/i }
            ]
        }).lean();
        
        if (user) {
            console.log("User found:", user.email, "ID:", user._id);
            console.log("Roles:", user.roles);
            
            const mentor = await Mentor.findOne({ userId: user._id }).lean();
            if (mentor) {
                console.log("Mentor record exists:", mentor._id);
            } else {
                console.log("CRITICAL: Mentor record MISSING for user ID:", user._id);
            }
        } else {
            console.log("User hassan.raza not found");
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
connectDB();
