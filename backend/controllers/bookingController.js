const Booking = require('../models/bookingModel');
const Slot = require('../models/slotModel');

const CONVERSION_RATE = 83; // 1 USD = 83 INR (Simulated)
const HOURLY_RATE_USD = 5;

exports.bookSlot = async (req, res) => {
    try {
        const { slotId, vehicleNumber, vehicleType } = req.body;
        const slot = await Slot.findById(slotId);

        if (!slot || slot.status === 'occupied') {
            return res.status(400).json({ message: 'Slot not available' });
        }

        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const booking = await Booking.create({
            user: req.user._id,
            slot: slotId,
            vehicleNumber,
            vehicleType,
        });

        slot.status = 'occupied';
        await slot.save();

        res.status(201).json(booking);
    } catch (error) {
        console.error('Booking Error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.exitSlot = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId).populate('slot');

        if (!booking || booking.exitTime) {
            return res.status(400).json({ message: 'Invalid booking or already exited' });
        }

        booking.exitTime = Date.now();
        booking.paymentStatus = 'pending'; 
        
        const duration = (booking.exitTime - booking.entryTime) / (1000 * 60 * 60);
        
        let hourlyRate = booking.slot?.price || 200;
        if (booking.vehicleType === 'Bike') hourlyRate = 100;
        else if (booking.vehicleType === 'Car') hourlyRate = 200;
        else if (booking.vehicleType === 'Truck') hourlyRate = 300;

        booking.totalAmount = Math.max(hourlyRate, Math.ceil(duration * hourlyRate));
        
        await booking.save();

        if (booking.slot) {
            const slot = await Slot.findById(booking.slot._id);
            if (slot) {
                slot.status = 'available';
                await slot.save();
            }
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.payBooking = async (req, res) => {
    try {
        const { bookingId, paymentMethod, transactionId } = req.body;
        const booking = await Booking.findById(bookingId);

        if (booking) {
            booking.paymentStatus = 'completed';
            booking.paymentMethod = paymentMethod || 'card';
            booking.transactionId = transactionId || `TXN${Date.now()}`;
            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('slot').sort('-createdAt');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
