const express = require('express');
const { getAdminStats, getAllUsers, getAllBookings, addSlot, deleteSlot, cancelBooking } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Admin middleware
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

router.get('/stats', protect, admin, getAdminStats);
router.get('/users', protect, admin, getAllUsers);
router.get('/bookings', protect, admin, getAllBookings);
router.post('/slots', protect, admin, addSlot);
router.delete('/slots/:id', protect, admin, deleteSlot);
router.put('/bookings/:id/cancel', protect, admin, cancelBooking);

module.exports = router;
