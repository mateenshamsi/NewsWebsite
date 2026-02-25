import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
export type Role = "user" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthed: boolean;
  isAdmin: boolean;
  isUser: boolean;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  register: (data: { name: string; email: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
  authHeaders: () => { "Content-Type": string; Authorization: string };
}

interface AuthResponse {
  token: string;
  user: User;
}

interface MeResponse {
  user: User;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [token, setToken]     = useState<string | null>(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError]     = useState<string | null>(null);
  const saveToken = (tkn: string): void => {
    setToken(tkn);
    localStorage.setItem("token", tkn);
  };

  const clearAuth = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const authHeaders = useCallback(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: authHeaders(),
        });

        if (!res.ok) throw new Error("Session expired");

        const data: MeResponse = await res.json();
        setUser(data.user);
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const register = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> => {
    setError(null);

    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data: AuthResponse & { message?: string } = await res.json();

    if (!res.ok) {
      const msg = data.message ?? "Registration failed";
      setError(msg);
      throw new Error(msg);
    }

    saveToken(data.token);
    setUser(data.user);
    return data.user;
  };
  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User> => {
    setError(null);

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data: AuthResponse & { message?: string } = await res.json();

    if (!res.ok) {
      const msg = data.message ?? "Login failed";
      setError(msg);
      throw new Error(msg);
    }

    saveToken(data.token);
    setUser(data.user);
    return data.user;
  };
  const logout = async (): Promise<void> => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: authHeaders(),
      });
    } catch {
    } finally {
      clearAuth();
    }
  };
  const isAdmin  = user?.role === "admin";
  const isUser   = user?.role === "user";
  const isAuthed = !!user;
  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    isAuthed,
    isAdmin,
    isUser,
    login,
    register,
    logout,
    authHeaders,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
