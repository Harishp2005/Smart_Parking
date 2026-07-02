const mongoose = require('mongoose');
const Slot = require('./models/slotModel');
const dotenv = require('dotenv');
dotenv.config();

async function verifyDelete() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const slot = await Slot.findOne({ slotNumber: 'V100' });
        if (slot) {
            console.log('Found slot V100, deleting...');
            await Slot.deleteOne({ _id: slot._id });
            console.log('Successfully deleted slot V100');
        } else {
            console.log('Slot V100 not found (maybe already deleted?)');
        }
        process.exit(0);
    } catch (err) {
        console.error('Failed:', err);
        process.exit(1);
    }
}

verifyDelete();
