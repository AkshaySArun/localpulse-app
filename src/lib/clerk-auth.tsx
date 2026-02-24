
"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { MockAuthDialog } from '@/components/MockAuthDialog';

const AuthDialogContext = React.createContext<{ open: () => void; close: () => void }>({
  open: () => { },
  close: () => { },
});

export const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <AuthDialogContext.Provider value={{
      open: () => setIsDialogOpen(true),
      close: () => setIsDialogOpen(false)
    }}>
      {children}
      <MockAuthDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </AuthDialogContext.Provider>
  );
};

export const isPlaceholderConfig = () => {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return !apiKey || apiKey === 'your-api-key' || apiKey === 'placeholder-api-key' || apiKey.includes('placeholder');
};

export const SignedIn = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : null;
};

export const SignedOut = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return !user ? <>{children}</> : null;
};

export const UserButton = (props: any) => {
  const { user, profile, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300 shadow-sm cursor-pointer" onClick={() => logout()}>
        <img
          src={profile?.photoURL || user.photoURL || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
          alt={profile?.displayName || user.displayName || "User"}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export const useUser = () => {
  const { user, profile, loading } = useAuth();
  return {
    isLoaded: !loading,
    isSignedIn: !!user,
    user: user ? {
      id: user.uid,
      fullName: profile?.displayName || user.displayName,
      primaryEmailAddress: { emailAddress: user.email },
      imageUrl: profile?.photoURL || user.photoURL,
      ...profile
    } : null,
  };
};

export const useClerk = () => {
  const { logout, mockLogin } = useAuth();
  const { open } = React.useContext(AuthDialogContext);

  const openSignIn = async (options?: any) => {
    if (isPlaceholderConfig()) {
      console.log("Placeholder Firebase config detected, opening mock registration.");
      open();
      return;
    }

    const provider = new GoogleAuthProvider();
    try {
      // Try real firebase first
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.warn("Firebase sign-in failed, falling back to mock registration:", error);
      open();
    }
  };

  const openSignUp = openSignIn;

  return {
    openSignIn,
    openSignUp,
    signOut: logout,
  };
};

export const UserProfile = (props: any) => {
  const { profile, user } = useAuth();
  if (!user) return null;

  return (
    <div className="p-6 border rounded-xl bg-card text-card-foreground shadow-sm">
      <h2 className="text-xl font-bold mb-6">User Profile</h2>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-bold text-slate-600 border-4 border-background shadow-sm overflow-hidden">
          {profile?.photoURL || user.photoURL ? (
            <img src={profile?.photoURL || user.photoURL || ""} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            (profile?.displayName?.[0] || user.displayName?.[0] || user.email?.[0] || "U").toUpperCase()
          )}
        </div>
        <div>
          <p className="text-lg font-semibold">{profile?.displayName || user.displayName || "User"}</p>
          <p className="text-muted-foreground">{user.email}</p>
          <p className="text-xs text-muted-foreground mt-1 bg-muted px-2 py-0.5 rounded-full inline-block">
            {profile?.role === 'organizer' ? 'Organizer' : 'User'}
          </p>
        </div>
      </div>
    </div>
  );
};
