import { useEffect, useRef } from 'react';

export default function ChatBackdrop() {
    const layerARef = useRef<SVGSVGElement>(null);
    const layerBRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        let raf: number;
        const start = performance.now();

        function animate(now: number) {
            const t = (now - start) / 1000;

            if (layerARef.current) {
                const x = Math.sin(t * 0.05) * 20;
                const y = Math.cos(t * 0.04) * 14;
                layerARef.current.style.transform = `translate(${x}px, ${y}px)`;
            }
            if (layerBRef.current) {
                const x = Math.cos(t * 0.03) * 30;
                const y = Math.sin(t * 0.035) * 18;
                layerBRef.current.style.transform = `translate(${x}px, ${y}px)`;
            }

            raf = requestAnimationFrame(animate);
        }

        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {/* Layer A — larger, sparser lines, drifts slower */}
            <svg
                ref={layerARef}
                className="absolute -inset-20 opacity-[0.06]"
                style={{ color: 'var(--color-ink)' }}
            >
                <defs>
                    <pattern id="schematic-a" width="180" height="180" patternUnits="userSpaceOnUse">
                        <path d="M0 90 H180 M90 0 V180" stroke="currentColor" strokeWidth="1" />
                        <circle cx="90" cy="90" r="36" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#schematic-a)" />
            </svg>

            {/* Layer B — finer grid, drifts opposite direction for parallax depth */}
            <svg
                ref={layerBRef}
                className="absolute -inset-20 opacity-[0.04]"
                style={{ color: 'var(--color-redline)' }}
            >
                <defs>
                    <pattern id="schematic-b" width="64" height="64" patternUnits="userSpaceOnUse">
                        <path d="M0 32 H64 M32 0 V64" stroke="currentColor" strokeWidth="0.75" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#schematic-b)" />
            </svg>
        </div>
    );
}