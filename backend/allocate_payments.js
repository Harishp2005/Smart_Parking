const mongoose = require('mongoose');
const Booking = require('./models/bookingModel');
const Slot = require('./models/slotModel');
const dotenv = require('dotenv');

dotenv.config();

async function allocatePayments() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Find all active bookings
        const activeBookings = await Booking.find({ status: 'active' });
        
        for (const booking of activeBookings) {
            booking.status = 'completed';
            booking.paymentStatus = 'completed';
            if (!booking.exitTime) {
                booking.exitTime = Date.now();
            }
            if (booking.totalAmount === 0) {
                booking.totalAmount = 415; // Set a default value (₹415 ≈ $5)
            }
            await booking.save();
            
            // Mark the slot as available
            await Slot.findByIdAndUpdate(booking.slot, { status: 'available' });
        }
        
        console.log(`Allocated payments to ${activeBookings.length} bookings.`);
        process.exit(0);
    } catch (error) {
        console.error('Error allocating payments:', error);
        process.exit(1);
    }
}

allocatePayments();
