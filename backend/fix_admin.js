const mongoose = require('mongoose');
const User = require('./models/userModel');
const dotenv = require('dotenv');
dotenv.config();

async function fixAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOneAndUpdate(
            { email: 'admin@park.com' },
            { role: 'admin' },
            { new: true }
        );
        if (user) {
            console.log('User role updated to admin:', user.email);
        } else {
            // Create it if it doesn't exist
            await User.create({
                name: 'System Admin',
                email: 'admin@park.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('Admin user created');
        }
        process.exit(0);
    } catch (err) {
        console.error('Failed:', err);
        process.exit(1);
    }
}

fixAdmin();
