const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Slot = require('./models/slotModel');
const User = require('./models/userModel');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
    try {
        await Slot.deleteMany();
        await User.deleteMany();

        // Seed Slots
        const slots = [];
        for (let i = 1; i <= 10; i++) {
            slots.push({ slotNumber: `A${i}`, floor: 'Ground Floor', status: 'available' });
        }
        for (let i = 1; i <= 10; i++) {
            slots.push({ slotNumber: `B${i}`, floor: 'First Floor', status: 'available' });
        }
        await Slot.insertMany(slots);

        // Seed Admin User
        await User.create({
            name: 'System Admin',
            email: 'admin@park.com',
            password: 'admin123',
            role: 'admin'
        });

        // Seed Regular User
        await User.create({
            name: 'John Doe',
            email: 'user1@park.com',
            password: 'user123',
            role: 'user'
        });

        console.log('Data Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        console.error(error.stack);
        process.exit(1);
    }
};

seedData();
