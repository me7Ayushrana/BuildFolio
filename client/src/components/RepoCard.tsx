import { ExternalLink, Github, Star } from "lucide-react";

interface RepoCardProps {
    repo: {
        name: string;
        description: string;
        stargazers_count: number;
        language: string;
        html_url: string;
        updated_at: string;
    };
}

export default function RepoCard({ repo }: RepoCardProps) {
    return (
        <div className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 transition-all">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Github size={16} className="text-zinc-500" />
                        <h3 className="text-sm font-semibold text-white truncate max-w-[150px]">{repo.name}</h3>
                    </div>
                    <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-white transition-colors"
                    >
                        <ExternalLink size={14} />
                    </a>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                    {repo.description || "No description provided."}
                </p>
            </div>

            <div className="flex items-center justify-between text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                <div className="flex items-center gap-3">
                    {repo.language && (
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-zinc-700"></span>
                            {repo.language}
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <Star size={12} />
                        {repo.stargazers_count}
                    </div>
                </div>
                <span>{new Date(repo.updated_at).toLocaleDateString()}</span>
            </div>
        </div>
    );
}
