import { useState, useCallback } from "react";

interface AuthUser {
  email: string;
}

interface IdentityInfo {
  fullName: string;
  username: string;
  socialLink: string;
  keywords: string;
  faceImage: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const session = localStorage.getItem("evara-session");
    return session ? JSON.parse(session) : null;
  });

  const register = useCallback((email: string, password: string, confirmPassword: string): string | null => {
    if (password !== confirmPassword) return "Passwords do not match";
    if (password.length < 6) return "Password must be at least 6 characters";
    const users = JSON.parse(localStorage.getItem("evara-users") || "{}");
    if (users[email]) return "Email already registered";
    users[email] = password;
    localStorage.setItem("evara-users", JSON.stringify(users));
    return null;
  }, []);

  const login = useCallback((email: string, password: string): string | null => {
    const users = JSON.parse(localStorage.getItem("evara-users") || "{}");
    if (!users[email] || users[email] !== password) return "Invalid email or password";
    const u = { email };
    localStorage.setItem("evara-session", JSON.stringify(u));
    setUser(u);
    return null;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("evara-session");
    setUser(null);
  }, []);

  const getIdentity = useCallback((): IdentityInfo | null => {
    const data = localStorage.getItem("evara-identity");
    return data ? JSON.parse(data) : null;
  }, []);

  const saveIdentity = useCallback((info: IdentityInfo) => {
    localStorage.setItem("evara-identity", JSON.stringify(info));
  }, []);

  return { user, register, login, logout, getIdentity, saveIdentity };
}
