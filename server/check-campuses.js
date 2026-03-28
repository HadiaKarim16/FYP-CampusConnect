import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Campus } from './src/models/campus.model.js';

dotenv.config();

async function checkCampuses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const campuses = await Campus.find({});
    console.log('Found campuses:', campuses.map(c => ({ id: c._id, name: c.name })));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkCampuses();
