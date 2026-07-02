const express = require('express');
const { getSlots, updateSlotStatus } = require('../controllers/slotController');
const router = express.Router();

router.get('/', getSlots);
router.put('/:id', updateSlotStatus);

module.exports = router;
