import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Zap className="h-5 w-5" />
          </div>
          ProjectIt
        </div>
        <nav className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center lg:py-32">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Study smarter, <br className="hidden sm:inline" />
            <span className="text-primary">together.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[600px] text-muted-foreground md:text-xl">
            Join virtual study rooms, collaborate in real-time, and master your subjects with a community of learners.
          </p>
          <div className="mt-10 flex gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Start Learning <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="https://github.com/arsalanbardsiri/ProjectIt" target="_blank">
              <Button variant="outline" size="lg">
                View on GitHub
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto grid gap-8 px-4 py-16 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Real-time Collaboration</h3>
            <p className="mt-2 text-muted-foreground">
              Chat with peers instantly using our high-performance WebSocket engine.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Topic-based Rooms</h3>
            <p className="mt-2 text-muted-foreground">
              Find the perfect study group for any subject, from Math to Computer Science.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Lightning Fast</h3>
            <p className="mt-2 text-muted-foreground">
              Built with Next.js and Redis for sub-millisecond latency and scalability.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>&copy; 2025 ProjectIt. Built by Arsalan Bardsiri.</p>
      </footer>
    </div>
  );
}
