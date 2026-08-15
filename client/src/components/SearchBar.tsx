import { Search } from 'lucide-react';

type Props = { value: string; onChange: (val: string) => void };

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div
      className="flex items-center gap-2 border rounded-sm px-4 py-2.5 focus-within:border-[var(--color-ink)] transition-colors w-full"
      style={{ borderColor: 'var(--color-border-strong)', background: 'var(--color-surface)' }}
    >
      <Search size={13} className="text-[var(--color-ink-muted)]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="search your library..."
        className="flex-1 text-sm bg-transparent outline-none font-mono placeholder:text-[var(--color-ink-muted)]"
      />
    </div>
  );
}