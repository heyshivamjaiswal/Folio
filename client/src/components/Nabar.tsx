import { BookMarked } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-card)] sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <BookMarked size={18} className="text-black" />
          <span className="font-semibold text-sm">BookmarkChat</span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className={`text-sm px-3 py-1.5 rounded-md ${
              location.pathname === '/'
                ? 'bg-[var(--color-border)]'
                : 'text-[var(--color-muted-foreground)]'
            }`}
          >
            Library
          </Link>

          {/* Clerk User */}
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </header>
  );
}
