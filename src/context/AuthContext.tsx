'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession } from '@/types';

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  postAuthRedirectAction: (() => void) | null;
  openAuthModal: (onSuccessAction?: () => void) => void;
  closeAuthModal: () => void;
  requestPhoneOtp: (phone: string) => Promise<{ success: boolean; message: string; cooldownSeconds?: number; debugOtp?: string; token?: string }>;
  verifyPhoneOtp: (phone: string, otp: string, token?: string) => Promise<{ success: boolean; message: string }>;
  loginWithSocial: (provider: 'google' | 'apple', details?: { name?: string; email?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'shree_fashion_session_v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [postAuthRedirectAction, setPostAuthRedirectAction] = useState<(() => void) | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load session:', err);
    }
  }, []);

  const openAuthModal = (onSuccessAction?: () => void) => {
    if (onSuccessAction) {
      setPostAuthRedirectAction(() => onSuccessAction);
    } else {
      setPostAuthRedirectAction(null);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPostAuthRedirectAction(null);
  };

  const requestPhoneOtp = async (phone: string) => {
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', phone })
      });
      return await res.json();
    } catch {
      return { success: false, message: 'Network connection failed' };
    }
  };

  const verifyPhoneOtp = async (phone: string, otp: string, token?: string) => {
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', phone, otp, token })
      });
      const data = await res.json();
      if (data.success && data.session) {
        setUser(data.session);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.session));
        setIsAuthModalOpen(false);
        if (postAuthRedirectAction) {
          postAuthRedirectAction();
          setPostAuthRedirectAction(null);
        }
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Verification failed' };
    } catch {
      return { success: false, message: 'Network error during verification' };
    }
  };

  const loginWithSocial = async (provider: 'google' | 'apple', details?: { name?: string; email?: string }) => {
    try {
      const defaultName = provider === 'google' ? 'Google Customer' : 'Apple Customer';
      const defaultEmail = `${provider}.customer@shreefashionhub.com`;

      const res = await fetch('/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          name: details?.name || defaultName,
          email: details?.email || defaultEmail
        })
      });
      const data = await res.json();
      if (data.success && data.session) {
        setUser(data.session);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.session));
        setIsAuthModalOpen(false);
        if (postAuthRedirectAction) {
          postAuthRedirectAction();
          setPostAuthRedirectAction(null);
        }
        return { success: true };
      }
      return { success: false, message: data.message || 'Social sign-in failed' };
    } catch {
      return { success: false, message: 'Network connection failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isAuthModalOpen,
        postAuthRedirectAction,
        openAuthModal,
        closeAuthModal,
        requestPhoneOtp,
        verifyPhoneOtp,
        loginWithSocial,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
