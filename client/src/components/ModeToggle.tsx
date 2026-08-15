type Props = {
    mode: 'narrow' | 'ask-anything';
    onChange: (mode: 'narrow' | 'ask-anything') => void;
};

export default function ModeToggle({ mode, onChange }: Props) {
    return (
        <div className="flex border rounded-sm overflow-hidden" style={{ borderColor: 'var(--color-border-strong)' }}>
            {(['narrow', 'ask-anything'] as const).map((m) => (
                <button
                    key={m}
                    onClick={() => onChange(m)}
                    className="px-3 py-1.5 text-coordinate transition-colors"
                    style={{
                        background: mode === m ? 'var(--color-ink)' : 'transparent',
                        color: mode === m ? 'var(--color-paper)' : 'var(--color-ink-muted)',
                    }}
                >
                    {m === 'narrow' ? 'This source' : 'Ask anything'}
                </button>
            ))}
        </div>
    );
}