export interface UserProfile {
    _id: string;
    firebaseId?: string;
    uid?: string;
    username: string;
    displayName: string;
    email: string;
    bio?: string;
    photoURL?: string;
    role?: string;
    githubUsername?: string;
    goals?: string[];
    skills?: string[];
    onboarded?: boolean;
    following?: string[];
    followers?: string[];
    savedProjects?: string[];
}

export interface Comment {
    _id?: string;
    userId: UserProfile | {
        _id: string;
        username: string;
        displayName: string;
        photoURL?: string;
    };
    text: string;
    createdAt: string | Date;
}

export interface Project {
    _id: string;
    userId: UserProfile;
    title: string;
    description: string;
    techStack: string[];
    imageUrl?: string;
    githubLink?: string;
    liveLink?: string;
    isLiked?: boolean;
    isSaved?: boolean;
    likesCount?: number;
    commentsCount?: number;
    likes?: string[];
    comments?: Comment[];
    createdAt: string | Date;
}

export interface AnalysisResult {
    score: number;
    readability: string;
    maintainability: string;
    security: string;
    suggestions: string[];
}
