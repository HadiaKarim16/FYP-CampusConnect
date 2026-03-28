import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config({ path: ".env" });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = mongoose.model("User", new mongoose.Schema({}, { strict: false }));
        const Mentor = mongoose.model("Mentor", new mongoose.Schema({}, { strict: false }));
        
        const email = "test.mentor@iba-suk.edu.pk";
        const password = await bcrypt.hash("Password123!", 12);
        
        // Delete if exists to start fresh
        await User.deleteOne({ email });
        
        const user = await User.create({
            email,
            password,
            roles: ["mentor"],
            role: "mentor",
            profile: {
                firstName: "Test",
                lastName: "Mentor",
                displayName: "Test Mentor",
            },
            status: "active",
            onboarding: { isComplete: true }
        });
        
        await Mentor.create({
            userId: user._id,
            bio: "I am a test mentor for verifying real-time functionality.",
            expertise: ["javascript", "react", "nodejs"],
            categories: ["technical"],
            verified: true,
            isActive: true,
            availability: []
        });

        console.log("Test mentor created successfully:");
        console.log("Email: test.mentor@iba-suk.edu.pk");
        console.log("Password: Password123!");
        
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
connectDB();
