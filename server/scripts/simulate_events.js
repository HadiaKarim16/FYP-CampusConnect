
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './.env' });

const mentorEmail = "hassanraza@iba-suk.edu.pk";
const studentEmail = "test.student@iba-suk.edu.pk"; // Using a known test student

async function runTest() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const User = mongoose.model('User', new mongoose.Schema({ email: String, profile: { displayName: String } }));
        const Mentor = mongoose.model('Mentor', new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, totalEarnings: Number, sessionsCompleted: Number, averageRating: Number }));
        const MentorBooking = mongoose.model('MentorBooking', new mongoose.Schema({ 
            mentorId: mongoose.Schema.Types.ObjectId, 
            menteeId: mongoose.Schema.Types.ObjectId,
            mentorUserId: mongoose.Schema.Types.ObjectId,
            startAt: Date,
            endAt: Date,
            status: String,
            topic: String,
            fee: Number,
            mentorPayout: Number
        }));

        const mentorUser = await User.findOne({ email: mentorEmail });
        const menteeUser = await User.findOne({ email: studentEmail });

        if (!mentorUser || !menteeUser) {
            console.error("Users not found");
            process.exit(1);
        }

        const mentorProfile = await Mentor.findOne({ userId: mentorUser._id });
        
        console.log("--- TEST CASE 1: NEW BOOKING ---");
        const newBooking = await MentorBooking.create({
            mentorId: mentorProfile._id,
            mentorUserId: mentorUser._id,
            menteeId: menteeUser._id,
            startAt: new Date(Date.now() + 86400000), // tomorrow
            endAt: new Date(Date.now() + 86400000 + 3600000),
            status: "pending",
            topic: "React State Management Deep Dive",
            fee: 40,
            mentorPayout: 35
        });
        console.log("Created pending booking:", newBooking._id);

        console.log("Done. Waiting for manual check...");
        setTimeout(() => mongoose.connection.close(), 1000);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

runTest();
