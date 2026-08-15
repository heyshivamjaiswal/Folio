
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import BookmarksPage from './pages/BookmarkPage';
import LandingPage from './pages/LandingPage';
import ProtectedLayout from './components/ProtectedLayout';
import { ThemeProvider } from './theme/ThemeProvider';
import { SignIn, SignUp } from '@clerk/clerk-react';

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col">
      <header className="px-6 h-16 flex items-center">
        <Link to="/" className="text-display text-sm text-[var(--color-ink)]">
          Folio
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center pb-16">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/sign-in"
            element={
              <AuthLayout>
                <SignIn
                  routing="path"
                  path="/sign-in"
                  signUpUrl="/sign-up"
                  fallbackRedirectUrl="/library"
                />
              </AuthLayout>
            }
          />
          <Route
            path="/sign-up"
            element={
              <AuthLayout>
                <SignUp
                  routing="path"
                  path="/sign-up"
                  signInUrl="/sign-in"
                  fallbackRedirectUrl="/library"
                />
              </AuthLayout>
            }
          />

          {/* Protected */}
          <Route element={<ProtectedLayout />}>
            <Route path="/library" element={<BookmarksPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}