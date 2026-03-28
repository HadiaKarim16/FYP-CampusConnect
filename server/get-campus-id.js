import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Campus } from './src/models/campus.model.js';

dotenv.config();

async function getCampus() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const campus = await Campus.findOne({ name: /Main Campus/i });
    if (campus) {
      console.log('Main Campus ID:', campus._id);
    } else {
      console.log('Main Campus not found');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

getCampus();
