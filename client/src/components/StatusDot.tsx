
import type { BookmarkStatus } from '../type';

const config: Record<BookmarkStatus, { color: string; label: string; pulse?: boolean }> = {
    pending: { color: 'var(--color-ink-muted)', label: 'queued' },
    processing: { color: 'var(--color-blueline)', label: 'processing', pulse: true },
    ready: { color: '#4A7A4E', label: 'ready' },
    failed: { color: 'var(--color-redline)', label: 'failed' },
};

export default function StatusDot({ status }: { status: BookmarkStatus }) {
    const c = config[status];
    return (
        <span className="inline-flex items-center gap-1.5 text-coordinate">
            <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: c.color, animation: c.pulse ? 'pulse 1.6s ease-in-out infinite' : undefined }}
            />
            {c.label}
        </span>
    );
}