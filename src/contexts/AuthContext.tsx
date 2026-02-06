'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const isOnVerifyPage = pathname?.includes('verify-account') ?? false;

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === 'undefined') return;
      if (isOnVerifyPage) {
        setLoading(false);
        return;
      }
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch {
            localStorage.removeItem('user');
          }
        }
        const userData = await authAPI.getCurrentUser();
        if (userData) {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (error: unknown) {
        const ax = error as { response?: { status?: number } };
        if (ax.response?.status === 401 || ax.response?.status === 403) {
          localStorage.removeItem('user');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [isOnVerifyPage]);

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

  const register = async (data: Record<string, unknown>) => {
    try {
      const nameParts = typeof data.name === 'string' ? data.name.trim().split(/\s+/) : [];
      const registerPayload = {
        firstName: (data.firstName as string) ?? nameParts[0] ?? '',
        lastName: (data.lastName as string) ?? (nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''),
        email: data.email as string,
        password: data.password as string,
        ...(data.birthDate || data.dateOfBirth ? { birthDate: (data.birthDate || data.dateOfBirth) as string } : {}),
        ...(data.country ? { country: data.country as string } : {}),
        ...(data.city ? { city: data.city as string } : {}),
        ...(data.currentSector || data.sector ? { currentSector: (data.currentSector || data.sector) as string } : {}),
        ...(data.preferredSector ? { preferredSector: data.preferredSector as string } : {}),
        ...(data.referralSource ? { referralSource: data.referralSource as string } : {}),
        ...(data.isTeamLeader !== undefined ? { isTeamLeader: data.isTeamLeader as boolean } : {}),
        ...(data.inviteCode ? { inviteCode: data.inviteCode as string } : {}),
        ...(data.role ? { role: data.role as string } : {}),
        ...(data.denomination ? { denomination: data.denomination as string } : {}),
        ...(data.churchName ? { churchName: data.churchName as string } : {}),
        ...(data.churchLocation ? { churchLocation: data.churchLocation as string } : {}),
      };
      await authAPI.register(registerPayload);
      localStorage.removeItem('user');
      setUser(null);
      router.push(`/verify-account?email=${encodeURIComponent((data.email as string) || '')}`);
    } catch (error: unknown) {
      const ax = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
      const errorMessage = ax.response?.data?.message
        || ax.response?.data?.error
        || ax.message
        || 'Registratie mislukt. Controleer je gegevens en probeer het opnieuw.';
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
      localStorage.removeItem('user');
      setUser(null);
      router.replace('/login');
    } catch (error: unknown) {
      const ax = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
      throw new Error(ax.response?.data?.message || ax.response?.data?.error || 'E-mailverificatie mislukt.');
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

