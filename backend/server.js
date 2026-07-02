const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/slots', require('./routes/slotRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
    res.send('Smart Parking System Backend is running...');
});

// Port
const PORT = process.env.PORT || 5000;

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    const fs = require('fs');
    fs.appendFileSync('server_debug_log.txt', `${new Date().toISOString()} - ${err.stack}\n`);
    res.status(500).json({ message: err.message });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {})
.then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
});
