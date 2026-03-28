import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Campus } from './src/models/campus.model.js';
import { User } from './src/models/user.model.js';

dotenv.config();

async function seedCampus() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if any campus exists
    let mainCampus = await Campus.findOne({ name: /Main Campus/i });
    if (!mainCampus) {
      mainCampus = await Campus.create({
        name: 'Sukkur IBA Main Campus',
        code: 'SIBA-MAIN',
        type: 'main',
        status: 'active',
        location: {
          address: 'Airport Road',
          city: 'Sukkur',
          province: 'Sindh',
          country: 'Pakistan'
        },
        contact: {
          website: 'https://www.iba-suk.edu.pk'
        }
      });
      console.log('Created Main Campus:', mainCampus._id);
    } else {
      console.log('Main Campus already exists:', mainCampus._id);
    }

    // Assign this campus to ALL users who don't have one for testing/migration
    const updateResult = await User.updateMany(
      { campusId: { $exists: false } },
      { $set: { campusId: mainCampus._id } }
    );
    console.log(`Updated ${updateResult.modifiedCount} users with default campusId.`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedCampus();
