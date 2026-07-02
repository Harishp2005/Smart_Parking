const mongoose = require('mongoose');
const User = require('./models/userModel');
const dotenv = require('dotenv');
dotenv.config();

async function removeUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const result = await User.deleteOne({ email: 'admin@park.com' });
        
        if (result.deletedCount > 0) {
            console.log('Account admin@park.com has been successfully removed.');
        } else {
            console.log('Account admin@park.com not found.');
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Removal failed:', err);
        process.exit(1);
    }
}

removeUser();
