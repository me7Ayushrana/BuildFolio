import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    techStack: string[];
    imageUrl?: string;
    githubLink: string;
    liveLink?: string;
    likes: mongoose.Types.ObjectId[];
    comments: {
        _id?: mongoose.Types.ObjectId;
        userId: mongoose.Types.ObjectId;
        text: string;
        createdAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [{ type: String }],
    imageUrl: { type: String },
    githubLink: { type: String, required: true },
    liveLink: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model<IProject>('Project', ProjectSchema);
