import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Navbar from './Nabar';
import { Outlet } from 'react-router-dom';

export default function ProtectedLayout() {
  return (
    <>
      <SignedIn>
        <Navbar />
        <Outlet />
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
