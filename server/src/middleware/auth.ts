import { Request, Response, NextFunction } from 'express';
import { authAdmin } from '../config/firebase.js';
import User from '../models/User.js';

export interface AuthRequest extends Request {
    user?: any; // You can define a more specific type
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await authAdmin.verifyIdToken(token!);
        const user = await User.findOne({ firebaseId: decodedToken.uid });

        if (!user && req.path !== '/sync') {
            return res.status(404).json({ message: 'User not found in database. Please sync.' });
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};
