import { Search } from 'lucide-react';

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 focus-within:border-black transition-colors w-full">
      <Search size={14} className="text-[var(--color-muted-foreground)]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search your library..."
        className="flex-1 text-sm bg-transparent outline-none"
      />
    </div>
  );
}
