const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function inspect() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const slotsCollection = mongoose.connection.db.collection('slots');
        const indexes = await slotsCollection.indexes();
        console.log('Indexes for slots:', JSON.stringify(indexes, null, 2));
        
        // Drop the problematic index if found
        for (const idx of indexes) {
            if (idx.name === 'slotId_1') {
                console.log('Dropping index:', idx.name);
                await slotsCollection.dropIndex(idx.name);
            }
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Failed:', err);
        process.exit(1);
    }
}

inspect();
