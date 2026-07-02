const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Slot = require('./models/slotModel');
dotenv.config();

async function listSlots() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const slots = await Slot.find({ floor: 'Second Floor' }).sort({ slotNumber: 1 });
        console.log('Second Floor Slots:', slots.map(s => s.slotNumber).join(', '));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
listSlots();
