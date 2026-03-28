
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './.env' });

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://admin:admin123@cluster0.v8q5i.mongodb.net/campus-connect?retryWrites=true&w=majority';

const mentorEmail = "hassanraza@iba-suk.edu.pk";
const studentEmail = "test.student@campusconnect.edu";

async function runTest() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(mongoUri);
        console.log("Connected.");

        const userSchema = new mongoose.Schema({ 
            email: { type: String, unique: true }, 
            password: { type: String, default: 'Password123!' },
            roles: [String],
            profile: { 
                displayName: String,
                firstName: String,
                lastName: String,
                avatar: String
            },
            status: { type: String, default: 'active' }
        }, { strict: false });

        const mentorSchema = new mongoose.Schema({ 
            userId: mongoose.Schema.Types.ObjectId, 
            totalEarnings: { type: Number, default: 0 }, 
            sessionsCompleted: { type: Number, default: 0 }, 
            averageRating: { type: Number, default: 0 },
            verified: { type: Boolean, default: true },
            isActive: { type: Boolean, default: true }
        }, { strict: false });

        const bookingSchema = new mongoose.Schema({ 
            mentorId: mongoose.Schema.Types.ObjectId, 
            menteeId: mongoose.Schema.Types.ObjectId,
            mentorUserId: mongoose.Schema.Types.ObjectId,
            startAt: Date,
            endAt: Date,
            status: String,
            topic: String,
            fee: Number,
            mentorPayout: Number,
            duration: Number
        }, { strict: false });

        const User = mongoose.models.User || mongoose.model('User', userSchema);
        const Mentor = mongoose.models.Mentor || mongoose.model('Mentor', mentorSchema);
        const MentorBooking = mongoose.models.MentorBooking || mongoose.model('MentorBooking', bookingSchema);

        // 1. Find Mentor
        const mentorUser = await User.findOne({ email: mentorEmail });
        if (!mentorUser) throw new Error("Mentor user not found");
        
        // Reset password for testing
        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.default.hash('Password123!', 10);
        await User.findByIdAndUpdate(mentorUser._id, { $set: { password: hashedPassword } });
        console.log("Mentor password reset to Password123!");
        
        const mentorProfile = await Mentor.findOne({ userId: mentorUser._id });
        if (!mentorProfile) throw new Error("Mentor profile not found");

        // 2. Create/Find Student
        let studentUser = await User.findOne({ email: studentEmail });
        if (!studentUser) {
            console.log("Creating test student...");
            studentUser = await User.create({
                email: studentEmail,
                roles: ["student"],
                profile: {
                    displayName: "Test Student",
                    firstName: "Test",
                    lastName: "Student",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Test"
                }
            });
            console.log("Student created.");
        }

        // 3. Cleanup old test bookings to avoid clutter
        await MentorBooking.deleteMany({ menteeId: studentUser._id });

        // 4. Create PENDING Booking
        console.log("Creating Test Case 1: Pending Booking...");
        await MentorBooking.create({
            mentorId: mentorProfile._id,
            mentorUserId: mentorUser._id,
            menteeId: studentUser._id,
            startAt: new Date(Date.now() + 86400000), // tomorrow
            endAt: new Date(Date.now() + 86400000 + 3600000),
            status: "pending",
            topic: "Automated Test Session",
            fee: 50,
            mentorPayout: 45,
            duration: 60
        });

        // 5. Create COMPLETED Booking for stats verification
        console.log("Creating Test Case 2: Completed Booking...");
        const completedBooking = await MentorBooking.create({
            mentorId: mentorProfile._id,
            mentorUserId: mentorUser._id,
            menteeId: studentUser._id,
            startAt: new Date(Date.now() - 172800000), // 2 days ago
            endAt: new Date(Date.now() - 172800000 + 3600000),
            status: "completed",
            topic: "Review Session on MongoDB",
            fee: 50,
            mentorPayout: 45,
            duration: 60,
            completedAt: new Date()
        });

        // 6. Create Review
        const MentorReview = mongoose.models.MentorReview || mongoose.model('MentorReview', new mongoose.Schema({
            bookingId: mongoose.Schema.Types.ObjectId,
            mentorId: mongoose.Schema.Types.ObjectId,
            menteeId: mongoose.Schema.Types.ObjectId,
            rating: Number,
            comment: String
        }, { strict: false }));

        console.log("Creating Test Case 3: Rating/Review...");
        const review = await MentorReview.create({
            bookingId: completedBooking._id,
            mentorId: mentorProfile._id,
            menteeId: studentUser._id,
            rating: 5,
            comment: "Excellent explanation of complex topics! Highly recommended."
        });

        await MentorBooking.findByIdAndUpdate(completedBooking._id, { $set: { reviewId: review._id } });

        // 7. Update Mentor Stats
        console.log("Updating Mentor Stats...");
        await Mentor.findByIdAndUpdate(mentorProfile._id, {
            $set: { averageRating: 5 },
            $inc: { totalEarnings: 45, sessionsCompleted: 1 }
        });

        console.log("--- SIMULATION COMPLETE ---");
        console.log("Mentor:", mentorEmail);
        console.log("Student:", studentEmail);
        
        process.exit(0);

    } catch (err) {
        console.error("Simulation failed:", err);
        process.exit(1);
    }
}

runTest();
