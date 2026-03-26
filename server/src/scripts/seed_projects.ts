import mongoose from 'mongoose';
import User from '../models/User.js';
import Project from '../models/Project.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/buildfolio';

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing demo data (optional, but good for clean state)
        // await User.deleteMany({ email: { $in: [/demo/i, /admin/i] } });
        // await Project.deleteMany({});

        const users = [
            {
                firebaseId: 'sam_altman_fake_id',
                email: 'sam@openai.com',
                username: 'samaltman',
                displayName: 'Sam Altman',
                bio: 'CEO at OpenAI. Working on AGI.',
                photoURL: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200',
                skills: ['AI', 'Strategy', 'Scaling']
            },
            {
                firebaseId: 'zuck_fake_id',
                email: 'zuck@meta.com',
                username: 'zuck',
                displayName: 'Mark Zuckerberg',
                bio: 'Building the future of social connection and the metaverse.',
                photoURL: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200',
                skills: ['Product', 'Social', 'Metaverse']
            },
            {
                firebaseId: 'demis_fake_id',
                email: 'demis@deepmind.com',
                username: 'demishassabis',
                displayName: 'Demis Hassabis',
                bio: 'CEO of Google DeepMind. Solving intelligence to advance science.',
                photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
                skills: ['AI', 'Neuroscience', 'Deep Learning']
            },
            {
                firebaseId: 'evan_fake_id',
                email: 'evan@snap.com',
                username: 'evanspiegel',
                displayName: 'Evan Spiegel',
                bio: 'CEO of Snap Inc. Inventing the future of the camera.',
                photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
                skills: ['Camera', 'AR', 'Social']
            }
        ];

        const createdUsers = [];
        for (const u of users) {
            let user = await User.findOne({ username: u.username });
            if (!user) {
                user = await User.create(u);
                console.log(`Created user: ${user.username}`);
            }
            createdUsers.push(user);
        }

        const sam = createdUsers.find(u => u.username === 'samaltman')!;
        const zuck = createdUsers.find(u => u.username === 'zuck')!;
        const demis = createdUsers.find(u => u.username === 'demishassabis')!;
        const evan = createdUsers.find(u => u.username === 'evanspiegel')!;

        const projects = [
            {
                userId: sam._id,
                title: 'ChatGPT-5 Early Preview',
                description: 'A revolutionary jump in reasoning and multi-modal understanding. This version features advanced long-term memory and agentic capabilities.',
                techStack: ['Python', 'PyTorch', 'Rust', 'Kubernetes'],
                githubLink: 'https://github.com/openai/chatgpt',
                imageUrl: '/images/showcases/chatgpt.png',
                likes: [zuck._id, demis._id],
                comments: [
                    { userId: zuck._id, text: 'The reasoning capabilities are impressive, Sam!', createdAt: new Date() },
                    { userId: demis._id, text: 'Great work. Competition breeds innovation.', createdAt: new Date() }
                ]
            },
            {
                userId: zuck._id,
                title: 'Instagram immersive Feed',
                description: 'Redesigning the social experience with AR-integrated posts and a 3D architecture for spatial computing.',
                techStack: ['React Native', 'C++', 'Wasm', 'GraphQL'],
                githubLink: 'https://github.com/meta/instagram-redesign',
                imageUrl: '/images/showcases/instagram.png',
                likes: [sam._id],
                comments: [
                    { userId: sam._id, text: 'Love the spatial focus. Good luck with the Quest integration.', createdAt: new Date() }
                ]
            },
            {
                userId: demis._id,
                title: 'Gemini 2.0 Ultra',
                description: 'Our most capable model yet, natively multimodal from the ground up, outperforming humans on MMLU benchmarks across the board.',
                techStack: ['TPU', 'JAX', 'C++', 'Python'],
                githubLink: 'https://github.com/google-deepmind/gemini',
                imageUrl: '/images/showcases/gemini.png',
                likes: [sam._id, zuck._id],
                comments: [
                    { userId: sam._id, text: 'The JAX implementation looks tight. Clean archi.', createdAt: new Date() }
                ]
            },
            {
                userId: evan._id,
                title: 'Snapchat Spectacles V5',
                description: 'The world\'s first true AR glasses. See the world through a digital-physical hybrid lens.',
                techStack: ['Android', 'Swift', 'OpenCV', 'Metal'],
                githubLink: 'https://github.com/snap/spectacles-os',
                imageUrl: 'https://images.unsplash.com/photo-1593361528657-3a1ec63595c2?auto=format&fit=crop&q=80&w=1200', // Fallback for Snap
                likes: [sam._id, demis._id],
                comments: [
                    { userId: sam._id, text: 'Hardware is hard, but you guys are nailing the OS.', createdAt: new Date() }
                ]
            }
        ];

        for (const p of projects) {
            const existing = await Project.findOne({ title: p.title });
            if (!existing) {
                await Project.create(p);
                console.log(`Created project: ${p.title}`);
            }
        }

        console.log('Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedData();
