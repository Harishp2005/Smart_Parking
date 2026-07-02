const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    slotNumber: {
        type: String,
        required: true,
        unique: true,
    },
    floor: {
        type: String,
        enum: ['Ground Floor', 'First Floor', 'Second Floor'],
        default: 'Ground Floor',
    },
    status: {
        type: String,
        enum: ['available', 'occupied'],
        default: 'available',
    },
    price: {
        type: Number,
        default: 200,
    }
}, { timestamps: true });

module.exports = mongoose.model('Slot', slotSchema);
