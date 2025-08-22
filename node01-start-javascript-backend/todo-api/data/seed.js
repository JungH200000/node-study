// todo-api/data/seed.js
import mongoose from 'mongoose';
import data from './mock.js';
import Task from '../models/Taks.js';
import dotenv from 'dotenv';

dotenv.config();

// 1. 데이터베이스에 연결합니다.
await mongoose.connect(process.env.DATABASE_URL);
console.log('🌱 DB Connection Successful');

// 2. 기존 데이터를 모두 삭제합니다. (초기화)
await Task.deleteMany({});
console.log('🗑️  All data deleted');

// 3. mock.js 파일의 데이터를 DB에 삽입합니다.
await Task.insertMany(data);
console.log('📥 Data seeded successfully');

// 4. 데이터베이스 연결을 종료합니다.
await mongoose.connection.close();
console.log('🚪 DB Connection Closed');
