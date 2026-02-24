"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    User,
    signOut as firebaseSignOut
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { UserProfile } from "@/types";
import { MOCK_USER } from "@/lib/mockData";

interface AuthContextType {
    user: any;
    profile: UserProfile | null;
    loading: boolean;
    logout: () => Promise<void>;
    mockLogin: (profileData?: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    logout: async () => { },
    mockLogin: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for mock session first
        const savedMockUser = localStorage.getItem('localpulse_mock_user');
        if (savedMockUser) {
            const parsed = JSON.parse(savedMockUser);
            setUser(parsed);
            setProfile(parsed);
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                // Fetch or create user profile in Firestore
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setProfile(userDoc.data() as UserProfile);
                } else {
                    // Default profile for new users
                    const newProfile: UserProfile = {
                        uid: user.uid,
                        email: user.email || "",
                        displayName: user.displayName || "",
                        photoURL: user.photoURL || "",
                        role: "user",
                        userType: "public",
                    };
                    try {
                        await setDoc(userDocRef, newProfile);
                    } catch (e) {
                        console.warn("Firestore setDoc failed, profile not saved (expected on first run with placeholder config)");
                    }
                    setProfile(newProfile);
                }
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        localStorage.removeItem('localpulse_mock_user');
        await firebaseSignOut(auth);
        setUser(null);
        setProfile(null);
    };

    const mockLogin = (profileData?: Partial<UserProfile>) => {
        const fullProfile = {
            ...MOCK_USER,
            ...profileData,
            uid: profileData?.uid || MOCK_USER.uid,
            displayName: profileData?.displayName || MOCK_USER.displayName,
            role: profileData?.role || 'user',
            userType: profileData?.userType || 'public',
        };
        localStorage.setItem('localpulse_mock_user', JSON.stringify(fullProfile));
        setUser(fullProfile);
        setProfile(fullProfile as unknown as UserProfile);
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, logout, mockLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
