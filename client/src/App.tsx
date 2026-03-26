import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookmarksPage from './pages/BookmarkPage';
import ProtectedLayout from './components/ProtectedLayout';
import { SignIn, SignUp } from '@clerk/clerk-react';

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/sign-in"
          element={
            <AuthLayout>
              <SignIn />
            </AuthLayout>
          }
        />
        <Route
          path="/sign-up"
          element={
            <AuthLayout>
              <SignUp />
            </AuthLayout>
          }
        />

        {/* Protected */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<BookmarksPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
