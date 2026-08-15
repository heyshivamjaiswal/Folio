
import { BookMarked } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const location = useLocation();

  return (
    <header
      className="border-b sticky top-0 z-50"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-paper)' }}
    >
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/library" className="flex items-center gap-2">
          <BookMarked size={16} />
          <span className="text-display text-xs">Folio</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/library"
            className="text-coordinate px-3 py-1.5 rounded-sm transition-colors"
            style={{
              background: location.pathname === '/library' ? 'var(--color-surface)' : 'transparent',
              color: location.pathname === '/library' ? 'var(--color-ink)' : 'var(--color-ink-muted)',
            }}
          >
            library
          </Link>
          <ThemeToggle />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </header>
  );
}