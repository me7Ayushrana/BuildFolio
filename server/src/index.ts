import express, { type Request, type Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import projectRoutes from './routes/projects.js';
import exploreRoutes from './routes/explore.js';
import socialRoutes from './routes/social.js';
import socialActionRoutes from './routes/social_actions.js';

// Middleware
app.use(cors({
    origin: [
        'https://build-folio-sigma.vercel.app',
        'https://buildfolio.vercel.app',
        /\.vercel\.app$/,
        'http://localhost:3000',
        'http://localhost:3001'
    ],
    credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/social-actions', socialActionRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Buildfolio API is running...');
});

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/buildfolio';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
