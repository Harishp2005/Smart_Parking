const User = require('../models/userModel');
const Slot = require('../models/slotModel');
const Booking = require('../models/bookingModel');

const getAdminStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const slotCount = await Slot.countDocuments();
        const activeBookings = await Booking.countDocuments({ exitTime: null, status: { $ne: 'cancelled' } });
        const totalRevenue = await Booking.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        res.json({
            userCount,
            slotCount,
            activeBookings,
            totalRevenue: totalRevenue[0]?.total || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user', 'name email').populate('slot').sort('-createdAt');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const addSlot = async (req, res) => {
    try {
        const { slotNumber, floor, price } = req.body;
        console.log('Adding slot:', slotNumber, 'on', floor, 'at', price);
        const slotExists = await Slot.findOne({ slotNumber });
        if (slotExists) {
            return res.status(400).json({ message: 'Slot already exists' });
        }
        const slot = await Slot.create({ 
            slotNumber, 
            floor: floor || 'Ground Floor', 
            status: 'available',
            price: price || 200 
        });
        res.status(201).json(slot);
    } catch (error) {
        console.error('Error in addSlot:', error);
        res.status(500).json({ message: error.message });
    }
};

const deleteSlot = async (req, res) => {
    try {
        console.log('Deleting slot ID:', req.params.id);
        const slot = await Slot.findById(req.params.id);
        if (slot) {
            // Check removed
            await slot.deleteOne();
            res.json({ message: 'Slot removed' });
        } else {
            res.status(404).json({ message: 'Slot not found' });
        }
    } catch (error) {
        console.error('Error in deleteSlot:', error);
        res.status(500).json({ message: error.message });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('slot');
        if (booking) {
            if (booking.status === 'cancelled') {
                return res.status(400).json({ message: 'Booking already cancelled' });
            }
            booking.status = 'cancelled';
            await booking.save();

            if (booking.slot) {
                const slot = await Slot.findById(booking.slot._id);
                if (slot) {
                    slot.status = 'available';
                    await slot.save();
                }
            }
            res.json({ message: 'Booking cancelled successfully', booking });
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        console.error('Error in cancelBooking:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAdminStats, getAllUsers, getAllBookings, addSlot, deleteSlot, cancelBooking };
