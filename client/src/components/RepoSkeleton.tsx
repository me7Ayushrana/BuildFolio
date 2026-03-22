export default function RepoSkeleton() {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-32 bg-zinc-800 rounded"></div>
                <div className="h-4 w-4 bg-zinc-800 rounded"></div>
            </div>
            <div className="space-y-2 mb-6">
                <div className="h-3 w-full bg-zinc-800 rounded"></div>
                <div className="h-3 w-2/3 bg-zinc-800 rounded"></div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex gap-4">
                    <div className="h-3 w-12 bg-zinc-800 rounded"></div>
                    <div className="h-3 w-8 bg-zinc-800 rounded"></div>
                </div>
                <div className="h-2 w-16 bg-zinc-800 rounded"></div>
            </div>
        </div>
    );
}
