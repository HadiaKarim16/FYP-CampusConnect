import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = mongoose.model("User", new mongoose.Schema({}, { strict: false }));
        const Mentor = mongoose.model("Mentor", new mongoose.Schema({}, { strict: false }));
        
        const user = await User.findOne({ email: "hassanraza@iba-suk.edu.pk" }).lean();
        
        if (user) {
            console.log("Found user ID:", user._id);
            
            const existingMentor = await Mentor.findOne({ userId: user._id });
            if (!existingMentor) {
                await Mentor.create({
                    userId: user._id,
                    bio: "Experienced mentor ready to help students.",
                    expertise: ["General Mentoring"],
                    categories: ["Academic"],
                    verified: true,
                    isActive: true,
                    availability: [],
                    socialLinks: [],
                    stats: {
                        totalSessions: 0,
                        totalStudents: 0,
                        rating: 0,
                        reviews: 0
                    }
                });
                console.log("SUCCESS: Mentor record created for Hassan.");
            } else {
                console.log("Mentor record already exists.");
            }
        } else {
            console.log("User not found");
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
connectDB();
