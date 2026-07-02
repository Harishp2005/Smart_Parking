const mongoose = require('mongoose');
const Booking = require('./models/bookingModel');
const Slot = require('./models/slotModel');
const dotenv = require('dotenv');

dotenv.config();

async function updateToTwoHundred() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // 1. Update all slots
        const slotResult = await Slot.updateMany({}, { price: 200 });
        console.log(`Updated ${slotResult.modifiedCount} slots to price ₹200.`);
        
        // 2. Update all bookings that have totalAmount = 0 or are active
        const bookingResult = await Booking.updateMany(
            { $or: [{ totalAmount: 0 }, { status: 'active' }] },
            { totalAmount: 200 }
        );
        console.log(`Updated ${bookingResult.modifiedCount} bookings to amount ₹200.`);
        
        // 3. (Optional) mark all active bookings as completed for "allocation" if requested
        // Let's stick to what was asked: price update.
        
        console.log('Bulk update to ₹200 completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error during bulk update:', error);
        process.exit(1);
    }
}

updateToTwoHundred();
