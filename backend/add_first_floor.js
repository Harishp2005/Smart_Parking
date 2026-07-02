const mongoose = require('mongoose');
const Slot = require('./models/slotModel');
const dotenv = require('dotenv');

dotenv.config();

async function addFirstFloorSlots() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        
        let addedCount = 0;
        const slots = [];
        for (let i = 1; i <= 10; i++) {
            const slotNumber = `F${i}`;
            const exists = await Slot.findOne({ slotNumber });
            if (!exists) {
                slots.push({ slotNumber, floor: 'First Floor', status: 'available', price: 200 });
            }
        }
        
        if (slots.length > 0) {
            await Slot.insertMany(slots);
            addedCount = slots.length;
            console.log(`Successfully added ${addedCount} available slots to the First Floor!`);
        } else {
            console.log('First floor slots already exist, no new slots added.');
        }
        process.exit(0);
    } catch (error) {
        console.error('Failed to add slots:', error);
        process.exit(1);
    }
}

addFirstFloorSlots();
