import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './src/models/user.model.js';

dotenv.config();

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ "profile.displayName": "society.coordinator" });
    if (user) {
      console.log('User roles:', user.roles);
      console.log('User status:', user.status);
      console.log('User campusId:', user.campusId);
    } else {
      console.log('User society.coordinator not found');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkUser();
