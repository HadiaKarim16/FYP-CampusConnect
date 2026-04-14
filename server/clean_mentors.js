import mongoose from 'mongoose';

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/fyp-campusconnect');
        const db = mongoose.connection.db;

        const mentors = await db.collection('mentors').find({}).toArray();
        const users = await db.collection('users').find({}).toArray();

        let deletedCount = 0;

        for (const m of mentors) {
            // Unnamed mentor is a mentor without a linked userId, or one whose associated user has no name
            const linkedUser = m.userId ? users.find(u => u._id.toString() === m.userId.toString()) : null;

            const isUnnamed = !linkedUser || (!m.name && (!linkedUser.name && !linkedUser.profile?.displayName && !linkedUser.profile?.firstName)) || m.name === 'Unnamed Mentor' || (linkedUser && linkedUser.name === 'Unnamed Mentor');

            if (isUnnamed) {
                console.log(`Deleting Mentor ${m._id} - Name: ${m.name}`);
                await db.collection('mentors').deleteOne({ _id: m._id });
                if (linkedUser) {
                    await db.collection('users').deleteOne({ _id: linkedUser._id });
                }
                deletedCount++;
            }
        }

        console.log(`Successfully deleted ${deletedCount} unnamed mentors.`);
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
})();
