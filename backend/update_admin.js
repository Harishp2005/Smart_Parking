const mongoose = require('mongoose');
const User = require('./models/userModel');
const dotenv = require('dotenv');
dotenv.config();

async function updateAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Find any existing admin
        const admin = await User.findOne({ role: 'admin' });
        
        if (admin) {
            admin.name = 'Harish';
            admin.email = 'harish@admin.com'; // Setting a professional admin email
            admin.password = 'Harish@7868';
            await admin.save();
            console.log('Admin credentials updated successfully.');
            console.log('New Username (Email): harish@admin.com');
            console.log('New Display Name: Harish');
        } else {
            // Create a new one if none exists
            await User.create({
                name: 'Harish',
                email: 'harish@admin.com',
                password: 'Harish@7868',
                role: 'admin'
            });
            console.log('New Admin user created with specified credentials.');
        }
        process.exit(0);
    } catch (err) {
        console.error('Update failed:', err);
        process.exit(1);
    }
}

updateAdmin();
