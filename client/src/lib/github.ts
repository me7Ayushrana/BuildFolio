import axios from 'axios';

export interface GitHubRepo {
    id: number;
    name: string;
    description: string;
    stargazers_count: number;
    language: string;
    updated_at: string;
    html_url: string;
}

export const fetchGitHubRepos = async (username: string): Promise<GitHubRepo[]> => {
    try {
        const response = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
        return response.data;
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        return [];
    }
};
