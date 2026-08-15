
import { useRef, useState, useEffect } from 'react';

const cards = [
    { label: 'field-notes.pdf', tag: 'PDF · p.12', rotate: -6, x: 0, y: 10 },
    { label: 'systems-talk', tag: 'YouTube · 4:32', rotate: 4, x: 60, y: 50 },
    { label: 'on-provenance.md', tag: 'Web', rotate: -2, x: 30, y: 90 },
];

export default function ReticleScene() {
    const ref = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [lockIndex, setLockIndex] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        function handleMove(e: MouseEvent) {
            const rect = el!.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            setOffset({ x: px * 14, y: py * 14 });
        }

        el.addEventListener('mousemove', handleMove);
        return () => el.removeEventListener('mousemove', handleMove);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setLockIndex((i) => (i + 1) % cards.length);
        }, 2600);
        return () => clearInterval(interval);
    }, []);

    const active = cards[lockIndex];

    return (
        <div
            ref={ref}
            className="relative h-[380px] rounded-sm border border-[var(--color-border)] bg-grid overflow-hidden"
        >
            <div
                className="absolute inset-0 transition-transform duration-300 ease-out"
                style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
            >
                {cards.map((c, i) => (
                    <div
                        key={c.label}
                        className="absolute w-40 rounded-sm border shadow-[var(--shadow-card)] px-3 py-3 transition-all duration-500"
                        style={{
                            left: `${c.x + 15}%`,
                            top: `${c.y}%`,
                            transform: `rotate(${c.rotate}deg)`,
                            background: 'var(--color-surface)',
                            borderColor: i === lockIndex ? 'var(--color-redline)' : 'var(--color-border)',
                            zIndex: i === lockIndex ? 10 : 1,
                        }}
                    >
                        <p className="text-coordinate mb-1 truncate">{c.label}</p>
                        <div className="h-1.5 w-3/4 bg-[var(--color-border)] rounded-full mb-1" />
                        <div className="h-1.5 w-1/2 bg-[var(--color-border)] rounded-full" />
                    </div>
                ))}
            </div>

            {/* Reticle */}
            <div
                className="absolute w-16 h-16 pointer-events-none transition-all duration-700 ease-out"
                style={{
                    left: `${cards[lockIndex].x + 15 + 8}%`,
                    top: `${cards[lockIndex].y - 4}%`,
                }}
            >
                <svg viewBox="0 0 64 64" className="w-full h-full">
                    <circle cx="32" cy="32" r="22" fill="none" stroke="var(--color-redline)" strokeWidth="1.2" />
                    <line x1="32" y1="0" x2="32" y2="14" stroke="var(--color-redline)" strokeWidth="1.2" />
                    <line x1="32" y1="50" x2="32" y2="64" stroke="var(--color-redline)" strokeWidth="1.2" />
                    <line x1="0" y1="32" x2="14" y2="32" stroke="var(--color-redline)" strokeWidth="1.2" />
                    <line x1="50" y1="32" x2="64" y2="32" stroke="var(--color-redline)" strokeWidth="1.2" />
                </svg>
            </div>

            <div
                className="absolute locator-chip transition-all duration-700"
                style={{
                    left: `${cards[lockIndex].x + 15}%`,
                    top: `${cards[lockIndex].y + 22}%`,
                }}
            >
                ⌖ {active.tag}
            </div>
        </div>
    );
}