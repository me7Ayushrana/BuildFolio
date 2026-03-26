export const PREMIUM_USERS = [
    {
        _id: "u1",
        firebaseId: 'sam_altman_fake_id',
        email: 'sam@openai.com',
        username: 'samaltman',
        displayName: 'Sam Altman',
        bio: 'CEO at OpenAI. Working on AGI.',
        photoURL: '/images/profiles/sam.png',
        skills: ['AI', 'Strategy', 'Scaling']
    },
    {
        _id: "u2",
        firebaseId: 'zuck_fake_id',
        email: 'zuck@meta.com',
        username: 'zuck',
        displayName: 'Mark Zuckerberg',
        bio: 'Building the future of social connection and the metaverse.',
        photoURL: '/images/profiles/zuck.png',
        skills: ['Product', 'Social', 'Metaverse']
    },
    {
        _id: "u3",
        firebaseId: 'demis_fake_id',
        email: 'demis@deepmind.com',
        username: 'demishassabis',
        displayName: 'Demis Hassabis',
        bio: 'CEO of Google DeepMind. Solving intelligence to advance science.',
        photoURL: '/images/profiles/demis.png',
        skills: ['AI', 'Neuroscience', 'Deep Learning']
    },
    {
        _id: "u4",
        firebaseId: 'evan_fake_id',
        email: 'evan@snap.com',
        username: 'evanspiegel',
        displayName: 'Evan Spiegel',
        bio: 'CEO of Snap Inc. Inventing the future of the camera.',
        photoURL: '/images/profiles/evan.png',
        skills: ['Camera', 'AR', 'Social']
    },
    {
        _id: "u5",
        firebaseId: 'jack_fake_id',
        email: 'jack@square.com',
        username: 'jack',
        displayName: 'Jack Dorsey',
        bio: 'Block, Square, TBD. Hyper-bitcoiner. Focusing on the open web.',
        photoURL: '/images/profiles/jack.png',
        skills: ['Payments', 'Web5', 'Bitcoin']
    },
    {
        _id: "u6",
        firebaseId: 'karpathy_fake_id',
        email: 'andrej@eureka.com',
        username: 'karpathy',
        displayName: 'Andrej Karpathy',
        bio: 'Building Eureka Labs. Formerly Tesla Autopilot and OpenAI.',
        photoURL: '/images/profiles/andrej.png',
        skills: ['Deep Learning', 'PyTorch', 'Education']
    },
    {
        _id: "u7",
        firebaseId: 'vitalik_fake_id',
        email: 'vitalik@ethereum.org',
        username: 'vitalik',
        displayName: 'Vitalik Buterin',
        bio: 'Co-founder of Ethereum. Decentralizing the world.',
        photoURL: '/images/profiles/vitalik.png',
        skills: ['Cryptography', 'Protocols', 'Rust']
    },
    {
        _id: "u8",
        firebaseId: 'chesky_fake_id',
        email: 'brian@airbnb.com',
        username: 'bchesky',
        displayName: 'Brian Chesky',
        bio: 'CEO at Airbnb. Design-led engineering.',
        photoURL: '/images/profiles/brian.png',
        skills: ['Design', 'Product', 'Branding']
    }
];

export const PREMIUM_PROJECTS = [
    {
        _id: "p1",
        userId: PREMIUM_USERS[0],
        title: 'ChatGPT-5 Early Preview',
        description: 'A revolutionary jump in reasoning and multi-modal understanding. This version features advanced long-term memory and agentic capabilities.',
        techStack: ['Python', 'PyTorch', 'Rust', 'Kubernetes'],
        githubLink: 'https://github.com/openai/chatgpt',
        imageUrl: '/images/showcases/chatgpt_real.png',
        likes: ["u2", "u3", "u5"],
        comments: [
            { userId: PREMIUM_USERS[1], text: 'The reasoning capabilities are impressive, Sam!', createdAt: new Date() },
            { userId: PREMIUM_USERS[2], text: 'Great work. Competition breeds innovation.', createdAt: new Date() }
        ],
        createdAt: new Date()
    },
    {
        _id: "p2",
        userId: PREMIUM_USERS[1],
        title: 'Meta AI: Spatial Intelligence',
        description: 'Introducing a new era of conversational intelligence that lives within your reality. Integrated across Quest, Glasses, and the Metaverse.',
        techStack: ['React Native', 'C++', 'Wasm', 'GraphQL'],
        githubLink: 'https://github.com/meta/ai-spatial',
        imageUrl: '/images/showcases/meta_ai.png',
        likes: ["u1", "u4"],
        comments: [
            { userId: PREMIUM_USERS[0], text: 'Love the spatial focus. Good luck with the Quest integration.', createdAt: new Date() }
        ],
        createdAt: new Date()
    },
    {
        _id: "p3",
        userId: PREMIUM_USERS[2],
        title: 'Gemini 2.0 Ultra',
        description: 'Our most capable model yet, natively multimodal from the ground up, outperforming humans on MMLU benchmarks across the board.',
        techStack: ['TPU', 'JAX', 'C++', 'Python'],
        githubLink: 'https://github.com/google-deepmind/gemini',
        imageUrl: '/images/showcases/gemini.png',
        likes: ["u1", "u2", "u6"],
        comments: [
            { userId: PREMIUM_USERS[0], text: 'The JAX implementation looks tight. Clean archi.', createdAt: new Date() }
        ],
        createdAt: new Date()
    },
    {
        _id: "p4",
        userId: PREMIUM_USERS[5],
        title: 'Eureka Labs: AI Tutor',
        description: 'An AI-native education platform that provides a personal tutor for every human on Earth. Built from the ground up for deep understanding.',
        techStack: ['Next.js', 'PyTorch', 'LLM', 'PostgreSQL'],
        githubLink: 'https://github.com/karpathy/eureka-labs',
        imageUrl: '/images/showcases/eureka_labs.png',
        likes: ["u1", "u2", "u3"],
        comments: [
            { userId: PREMIUM_USERS[0], text: 'Education is the best use case for LLMs. Brilliant.', createdAt: new Date() }
        ],
        createdAt: new Date()
    },
    {
        _id: "p5",
        userId: PREMIUM_USERS[4],
        title: 'TBD: Web5 Toolkit',
        description: 'The decentralized web platform. Reclaiming identity and data for every individual on the internet.',
        techStack: ['Go', 'IPFS', 'DID', 'LevelDB'],
        githubLink: 'https://github.com/TBD54566975/web5-js',
        imageUrl: '/images/showcases/ethereum_merge.png', // Fallback to merge viz as it looks technical
        likes: ["u7"],
        comments: [
            { userId: PREMIUM_USERS[6], text: 'The DID implementation is solid. Let\'s collab.', createdAt: new Date() }
        ],
        createdAt: new Date()
    },
    {
        _id: "p6",
        userId: PREMIUM_USERS[6],
        title: 'Ethereum Proof-of-Stake',
        description: 'The most sustainable and secure decentralized protocol in the world. Energy consumption reduced by 99.9%.',
        techStack: ['Rust', 'Go', 'Solidity', 'P2P'],
        githubLink: 'https://github.com/ethereum/go-ethereum',
        imageUrl: '/images/showcases/ethereum_merge.png',
        likes: ["u5", "u1"],
        comments: [
            { userId: PREMIUM_USERS[4], text: 'Vitalik, the merge was historic. Huge milestone.', createdAt: new Date() }
        ],
        createdAt: new Date()
    },
    {
        _id: "p7",
        userId: PREMIUM_USERS[3],
        title: 'Snapchat Spectacles V5',
        description: 'The world\'s first true AR glasses. See the world through a digital-physical hybrid lens.',
        techStack: ['Android', 'Swift', 'OpenCV', 'Metal'],
        githubLink: 'https://github.com/snap/spectacles-os',
        imageUrl: '/images/showcases/snapchat_spectacles.png',
        likes: ["u1", "u3"],
        comments: [
            { userId: PREMIUM_USERS[1], text: 'Hardware is hard, but you guys are nailing the OS.', createdAt: new Date() }
        ],
        createdAt: new Date()
    },
    {
        _id: "p8",
        userId: PREMIUM_USERS[0], // Sam Altman actually likes Tesla
        title: 'Tesla FSD v12.4',
        description: 'End-to-end neural network-based autonomous driving. Real-time inference on custom hardware.',
        techStack: ['C++', 'PyTorch', 'CUDA', 'Real-time OS'],
        githubLink: 'https://github.com/tesla/fsd-logic',
        imageUrl: '/images/showcases/tesla_fsd.png',
        likes: ["u6", "u1"],
        comments: [
            { userId: PREMIUM_USERS[5], text: 'Massive progress on the end-to-end model.', createdAt: new Date() }
        ],
        createdAt: new Date()
    }
];
