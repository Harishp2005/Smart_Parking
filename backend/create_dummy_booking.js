const mongoose = require('mongoose');
const Booking = require('./models/bookingModel');
const User = require('./models/userModel');
const Slot = require('./models/slotModel');
const dotenv = require('dotenv');
dotenv.config();

async function createDummy() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: 'admin@park.com' });
        const slot = await Slot.findOne({ slotNumber: 'A1' });
        
        // Clear old bookings for A1 to avoid conflicts if needed
        await Booking.deleteMany({ slot: slot._id });
        
        const booking = await Booking.create({
            user: user._id,
            slot: slot._id,
            vehicleNumber: 'KA-01-HH-1234',
            vehicleType: 'Car',
            entryTime: new Date()
        });
        
        slot.status = 'occupied';
        await slot.save();
        
        console.log('Dummy booking created:', booking._id);
        process.exit(0);
    } catch (err) {
        console.error('Failed:', err);
        process.exit(1);
    }
}

createDummy();
