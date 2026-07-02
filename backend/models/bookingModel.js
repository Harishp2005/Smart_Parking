const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    slot: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Slot',
    },
    vehicleNumber: {
        type: String,
        required: true,
    },
    vehicleType: {
        type: String,
        required: true,
    },
    entryTime: {
        type: Date,
        default: Date.now,
    },
    exitTime: {
        type: Date,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending',
    },
    totalAmount: {
        type: Number,
        default: 0,
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'upi', 'none'],
        default: 'none',
    },
    transactionId: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active',
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
