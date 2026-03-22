import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { Github } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <Hero />

      {/* Featured Projects Section (Placeholder) */}
      <section className="py-24 border-t border-zinc-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Featured Projects</h2>
            <p className="mt-4 text-zinc-400">Discover top projects built by our developer community.</p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group relative flex flex-col items-start gap-4 rounded-3xl border border-zinc-800 p-8 hover:border-zinc-700 transition-colors bg-zinc-900/30">
                <div className="h-48 w-full rounded-xl bg-zinc-800 overflow-hidden mb-4">
                  {/* Placeholder image */}
                  <div className="h-full w-full bg-gradient-to-br from-zinc-800 to-zinc-900"></div>
                </div>
                <h3 className="text-lg font-semibold text-white">Project Title {i}</h3>
                <p className="text-zinc-400 text-sm line-clamp-2">A beautiful description of what this project does and the problems it solves.</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-300 border border-zinc-700">Next.js</span>
                  <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-300 border border-zinc-700">Tailwind</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-zinc-900 bg-black/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">© 2026 Buildfolio. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Github size={18} /></a>
          </div>
        </div>
      </footer>
    </main>
  );
}
