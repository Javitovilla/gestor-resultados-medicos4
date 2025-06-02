
"use client";

import type React from 'react';
import { createContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'authToken';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      // localStorage might not be available (e.g. SSR, private browsing)
      console.warn("Could not access localStorage for auth token:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
        router.push('/dashboard');
      } else if (!isAuthenticated && pathname !== '/login' && pathname !== '/signup' && !pathname.startsWith('/_next/')) {
         // Allow access to root page which redirects
        if (pathname !== '/') {
          router.push('/login');
        }
      }
    }
  }, [isAuthenticated, loading, router, pathname]);

  const login = (token: string) => {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (error) {
      console.warn("Could not set auth token in localStorage:", error);
    }
    setIsAuthenticated(true);
    router.push('/dashboard');
  };

  const logout = () => {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.warn("Could not remove auth token from localStorage:", error);
    }
    setIsAuthenticated(false);
    router.push('/login');
  };

  if (loading && !pathname.startsWith('/_next/') && pathname !== '/login' && pathname !== '/signup' && pathname !== '/') {
     // Show a generic loading state or null to prevent flash of content if not on public pages
     return <div className="flex items-center justify-center min-h-screen bg-background"><p>Loading...</p></div>;
  }
  
  // If on a public path or auth check is complete, render children.
  if (pathname === '/login' || pathname === '/signup' || pathname === '/' || !loading) {
    return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
        {children}
      </AuthContext.Provider>
    );
  }

  // Fallback for protected routes while loading (should be covered by above)
  return <div className="flex items-center justify-center min-h-screen bg-background"><p>Loading...</p></div>;
}
