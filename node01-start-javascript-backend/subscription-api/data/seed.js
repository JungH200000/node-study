import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Subscription from '../models/Subscription.js';
import data from './mock.js';

dotenv.config();

await mongoose.connect(process.env.DATABASE_URL);
console.log('🌱 DB Connection Successful');

await Subscription.deleteMany({});
console.log('🗑️  All data deleted');

await Subscription.insertMany(data);
console.log('📥 Data seeded successful');

await mongoose.connection.close();
console.log('🚪 Data Connection Closed');
