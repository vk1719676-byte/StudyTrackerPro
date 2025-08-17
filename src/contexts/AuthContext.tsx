import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  showTelegramModal: boolean;
  isPremium: boolean;
  setShowTelegramModal: (show: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const fetchUserData = async (firebaseUser: FirebaseUser) => {
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      let userData: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || undefined,
        isPremium: false,
        premiumPlan: undefined,
        premiumExpiresAt: undefined,
        subscriptionId: undefined
      };

      if (userDoc.exists()) {
        const data = userDoc.data();
        userData = {
          ...userData,
          isPremium: data.isPremium || false,
          premiumPlan: data.premiumPlan,
          premiumExpiresAt: data.premiumExpiresAt?.toDate(),
          subscriptionId: data.subscriptionId
        };
      } else {
        // Create user document if it doesn't exist
        await setDoc(userDocRef, {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          isPremium: false,
          createdAt: new Date(),
          lastLoginAt: new Date()
        });
      }

      // Check if premium subscription is still valid
      if (userData.isPremium && userData.premiumExpiresAt) {
        const isExpired = userData.premiumExpiresAt < new Date();
        if (isExpired) {
          userData.isPremium = false;
          userData.premiumPlan = undefined;
          // Update in Firestore
          await setDoc(userDocRef, { isPremium: false, premiumPlan: null }, { merge: true });
        }
      }

      setUser(userData);
      setIsPremium(userData.isPremium || false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || undefined,
        isPremium: false
      });
      setIsPremium(false);
    }
  };

  const refreshUserData = async () => {
    if (auth.currentUser) {
      await fetchUserData(auth.currentUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        await fetchUserData(firebaseUser);
        const isNewUser = !localStorage.getItem(`telegram-joined-${firebaseUser.uid}`);
        
        // Show Telegram modal for new users after a short delay
        if (isNewUser) {
          setTimeout(() => {
            setShowTelegramModal(true);
          }, 1500);
        }
      } else {
        setUser(null);
        setIsPremium(false);
      }
      setLoading(false);
    });

    // Handle redirect result for mobile OAuth
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        console.log('OAuth redirect successful');
      }
    }).catch((error) => {
      console.error('OAuth redirect error:', error);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    try {
      // Try popup first (works better on desktop)
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      // If popup fails (mobile/blocked), use redirect
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
        await signInWithRedirect(auth, googleProvider);
      } else {
        throw error;
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    showTelegramModal,
    isPremium,
    setShowTelegramModal,
    login,
    register,
    loginWithGoogle,
    logout,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};