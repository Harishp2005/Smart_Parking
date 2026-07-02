const express = require('express');
const { bookSlot, exitSlot, getMyBookings, payBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/book', protect, bookSlot);
router.post('/exit', protect, exitSlot);
router.get('/my', protect, getMyBookings);
router.post('/pay', protect, payBooking);

module.exports = router;
