import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Society } from './src/models/society.model.js';
import { User } from './src/models/user.model.js';

dotenv.config();

async function checkSocieties() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ "profile.displayName": "society.coordinator" });
    if (user) {
      const societies = await Society.find({ createdBy: user._id });
      console.log('Societies for coordinator:', societies.map(s => ({ name: s.name, tag: s.tag, status: s.status })));
    } else {
      console.log('User society.coordinator not found');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSocieties();
