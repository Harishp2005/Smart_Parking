const Slot = require('../models/slotModel');

const getSlots = async (req, res) => {
    try {
        const slots = await Slot.find({});
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSlotStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const slot = await Slot.findById(id);

        if (slot) {
            slot.status = status;
            const updatedSlot = await slot.save();
            res.json(updatedSlot);
        } else {
            res.status(404).json({ message: 'Slot not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getSlots, updateSlotStatus };
