import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './src/models/user.model.js';

dotenv.config();

async function updateCoordinator() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const campusId = new mongoose.Types.ObjectId('69c6c87159b72624d25f99a3');
    const result = await User.updateOne(
        { "profile.displayName": "society.coordinator" },
        { $set: { campusId: campusId } }
    );
    console.log('Update result:', result);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateCoordinator();
