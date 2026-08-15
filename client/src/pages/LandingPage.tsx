import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import ThemeToggle from '../components/ThemeToggle';
import ReticleScene from '@/components/ReticleScene';

export default function LandingPage() {
    const { isSignedIn, isLoaded } = useAuth();

    if (isLoaded && isSignedIn) {
        return <Navigate to="/library" replace />;
    }

    return (
        <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
            {/* Top bar */}
            <header className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <span className="text-display text-sm">ATLAS</span>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link to="/sign-in" className="btn-ghost text-sm">
                        Sign in
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <p className="text-eyebrow mb-5">// source-verified retrieval</p>
                    <h1 className="text-display text-[2.75rem] md:text-[3.5rem] mb-6">
                        Every answer,
                        <br />
                        traced to the line
                        <br />
                        it came from.
                    </h1>
                    <p className="text-[var(--color-ink-muted)] text-[1.0625rem] leading-relaxed max-w-md mb-8">
                        Atlas reads your PDFs, articles, and videos, then answers your questions —
                        showing you the exact page, timestamp, or paragraph behind every claim.
                        Nothing is stated without a source you can check yourself.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link to="/sign-up" className="btn-locator">
                            Start reading →
                        </Link>
                        <a href="#how-it-works" className="btn-ghost">
                            See how it works
                        </a>
                    </div>
                </div>

                <ReticleScene />
            </section>

            {/* How it works */}
            <section id="how-it-works" className="border-t border-[var(--color-border)]">
                <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-10">
                    <Step
                        path="/ingest"
                        title="Bring in your sources"
                        body="Upload a PDF, paste an article link, or drop a YouTube video. Atlas reads it page by page, paragraph by paragraph, and never flattens the structure it came from."
                    />
                    <Step
                        path="/ask"
                        title="Ask in plain language"
                        body="Question one saved source directly, or switch to Ask Anything to search across everything you've saved — and the open web, only when your own content comes up short."
                    />
                    <Step
                        path="/locate"
                        title="Get the exact location"
                        body="Every claim in the answer carries its source: PDF page number, video timestamp, or article link. If two sources disagree, Atlas tells you that too, instead of picking one quietly."
                    />
                </div>
            </section>

            {/* Differentiator strip */}
            <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
                <div className="max-w-6xl mx-auto px-6 py-20">
                    <p className="text-eyebrow mb-8">// what makes this different</p>
                    <div className="grid md:grid-cols-2 gap-8">
                        <Diff
                            title="It admits when it's guessing"
                            body="Most retrieval tools blend saved content with general knowledge and never tell you which is which. Atlas labels every fallback to the open web explicitly, right in the answer."
                        />
                        <Diff
                            title="Citations you can actually click"
                            body="A page number or timestamp is only useful if it takes you there. Every source in Atlas links to the precise page or moment it was pulled from."
                        />
                    </div>
                </div>
            </section>

            <footer className="max-w-6xl mx-auto px-6 py-10 flex items-center justify-between text-coordinate">
                <span>ATLAS</span>
                <span>Built for precision, not vibes.</span>
            </footer>
        </div>
    );
}

function Step({ path, title, body }: { path: string; title: string; body: string }) {
    return (
        <div>
            <p className="text-eyebrow text-[var(--color-redline)] mb-3">{path}</p>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed">{body}</p>
        </div>
    );
}

function Diff({ title, body }: { title: string; body: string }) {
    return (
        <div className="border border-[var(--color-border)] rounded-sm p-6 bg-[var(--color-paper)]">
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed">{body}</p>
        </div>
    );
}