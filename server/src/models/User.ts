import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    firebaseId: string;
    email: string;
    username: string;
    displayName?: string;
    photoURL?: string;
    bio?: string;
    skills: string[];
    githubUsername?: string;
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    savedProjects: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    firebaseId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    displayName: { type: String },
    photoURL: { type: String },
    bio: { type: String },
    skills: [{ type: String }],
    githubUsername: { type: String },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    savedProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
}, { timestamps: true });

UserSchema.index({ username: 'text', displayName: 'text' });

export default mongoose.model<IUser>('User', UserSchema);
