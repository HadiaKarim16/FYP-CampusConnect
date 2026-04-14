import 'dotenv/config';
import mongoose from 'mongoose';

(async () => {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;

        console.log('Fetching mentors and users...');
        const mentors = await db.collection('mentors').find({}).toArray();
        const users = await db.collection('users').find({}).toArray();

        let orphans = [];
        for (let m of mentors) {
            const user = users.find(u => u._id.toString() === m.userId?.toString());
            const fallback = user?.profile?.displayName || user?.profile?.firstName || m.name || 'Unnamed Mentor';
            if (fallback === 'Unnamed Mentor') orphans.push({ _id: m._id, userId: m.userId });
        }

        console.log('Total Mentors:', mentors.length);
        console.log('Evaluation orphans:', orphans.length);
        console.dir(orphans, { depth: null });

        const ids = orphans.map(o => o._id);
        if (ids.length > 0) {
            await db.collection('mentors').deleteMany({ _id: { $in: ids } });
            console.log(`Deleted exact ${ids.length} Unnamed Mentors listed above!`);
        } else {
            console.log('No Unnamed Mentors were found to delete.');
        }

    } catch (e) {
        console.error('Error during cleanup:', e);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected. Exiting.');
        process.exit(0);
    }
})();
