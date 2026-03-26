import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

import User from '../models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/buildfolio';

async function seedDevUser() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const devUser = {
            firebaseId: 'dev-uid',
            email: 'dev@buildfolio.com',
            username: 'dev',
            displayName: 'Dev Engineer',
            photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop',
            bio: 'Lead Architect @ Buildfolio. Exploring the intersection of AGI and Decentralized Systems.',
            skills: ['Next.js', 'Node.js', 'Mongoose', 'Framer Motion'],
            followers: [],
            following: [],
            savedProjects: []
        };

        const existingUser = await User.findOne({ username: 'dev' });
        if (existingUser) {
            console.log('Dev user already exists.');
        } else {
            await User.create(devUser);
            console.log('Dev user created successfully!');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding dev user:', error);
        process.exit(1);
    }
}

seedDevUser();
