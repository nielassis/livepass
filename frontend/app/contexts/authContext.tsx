"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { User, UserRole } from "../utils/auth/types";

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  isBootstrapping: boolean;
  isSigningIn: boolean;
  signIn: (data: { email: string; password: string }) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const MOCK_USER: User = {
  id: "usr_123",
  email: "admin@livepass.com",
  name: "Admin",
  role: "ADMIN" as UserRole,
  organizationId: "org_123",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();

  const fetchUser = useCallback(() => {
    const token = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
    }
    setIsBootstrapping(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      setIsSigningIn(true);

      await new Promise((resolve) => setTimeout(resolve, 800));

      if (email && password.length >= 4) {
        const mockToken = "mock_jwt_token_" + Date.now();
        const userWithEmail = { ...MOCK_USER, email, name: email.split("@")[0] };

        localStorage.setItem("auth_token", mockToken);
        localStorage.setItem("auth_user", JSON.stringify(userWithEmail));

        setUser(userWithEmail);
        router.push("/dashboard");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setIsSigningIn(false);
    }
  };

  const signOut = async () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isBootstrapping,
        isSigningIn,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);