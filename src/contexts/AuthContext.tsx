'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, User } from '@/lib/api/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ message: string; token: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing authenticated user on mount
    const initAuth = async () => {
      try {
        // Try to restore user from localStorage first (for quick UI update)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch {
            localStorage.removeItem('user');
          }
        }

        // Then verify with API
        const userData = await authAPI.getCurrentUser();
        if (userData) {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          // Not authenticated, clear stored user
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (error: any) {
        // 401 or other error - not authenticated
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('user');
          setUser(null);
        }
        // Don't log other errors as they might be network issues
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      setUser(response.user);
      // Store user in localStorage for quick access (not for auth, cookies handle that)
      localStorage.setItem('user', JSON.stringify(response.user));
      // Use window.location for full page reload to ensure cookies are set
      window.location.href = '/dashboard';
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Inloggen mislukt.');
    }
  };

  const register = async (data: any) => {
    try {
      // Map form fields to API RegisterData (docs/API_REFERENCE.md: firstName, lastName, email, password + optional)
      const nameParts = typeof data.name === 'string' ? data.name.trim().split(/\s+/) : [];
      const registerPayload = {
        firstName: data.firstName ?? nameParts[0] ?? '',
        lastName: data.lastName ?? (nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''),
        email: data.email,
        password: data.password,
        ...(data.birthDate || data.dateOfBirth ? { birthDate: data.birthDate || data.dateOfBirth } : {}),
        ...(data.country ? { country: data.country } : {}),
        ...(data.city ? { city: data.city } : {}),
        ...(data.currentSector || data.sector ? { currentSector: data.currentSector || data.sector } : {}),
        ...(data.preferredSector ? { preferredSector: data.preferredSector } : {}),
        ...(data.referralSource ? { referralSource: data.referralSource } : {}),
        ...(data.isTeamLeader !== undefined ? { isTeamLeader: data.isTeamLeader } : {}),
        ...(data.inviteCode ? { inviteCode: data.inviteCode } : {}),
        ...(data.role ? { role: data.role } : {}),
        ...(data.denomination ? { denomination: data.denomination } : {}),
        ...(data.churchName ? { churchName: data.churchName } : {}),
        ...(data.churchLocation ? { churchLocation: data.churchLocation } : {}),
      };
      const response = await authAPI.register(registerPayload);
      // After registration, redirect to verify account page
      if (response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        router.push('/dashboard');
      } else {
        router.push(`/verify-account?email=${encodeURIComponent(data.email)}`);
      }
    } catch (error: any) {
      // Extract error message from API response
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message || 
                          'Registratie mislukt. Controleer je gegevens en probeer het opnieuw.';
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem('user');
      setUser(null);
      router.push('/login');
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await authAPI.forgotPassword({ email });
      return response; // Return response with token
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to send reset email');
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await authAPI.resetPassword({ token, newPassword });
      router.push('/login');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Wachtwoord resetten mislukt.');
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      await authAPI.verifyEmail(token);
      // After verification, fetch current user
      const userData = await authAPI.getCurrentUser();
      if (userData) {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'E-mailverificatie mislukt.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

