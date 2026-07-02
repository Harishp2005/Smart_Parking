const mongoose = require('mongoose');
const Slot = require('./models/slotModel');
const dotenv = require('dotenv');

dotenv.config();

async function resetSlots() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const result = await Slot.updateMany({}, { status: 'available' });
        console.log(`Updated ${result.modifiedCount} slots to available.`);
        process.exit(0);
    } catch (error) {
        console.error('Error resetting slots:', error);
        process.exit(1);
    }
}

resetSlots();
