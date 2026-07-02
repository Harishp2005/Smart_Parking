const mongoose = require('mongoose');
const Slot = require('./models/slotModel');
const dotenv = require('dotenv');

dotenv.config();

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const result = await Slot.updateMany(
            { floor: { $exists: false } },
            { $set: { floor: 'Ground Floor' } }
        );
        console.log(`Migrated ${result.modifiedCount} slots.`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
