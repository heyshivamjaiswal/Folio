import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Navbar from './Navbar';
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
