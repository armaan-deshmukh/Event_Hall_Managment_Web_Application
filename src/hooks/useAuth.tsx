import { useState, useEffect, createContext, useContext } from "react";
import api from "@/lib/api";

// Define the User type based on our backend's user object
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // You might want a '/api/auth/me' endpoint to verify the token and get user data
          // For now, we'll decode the token.
          // Note: This is not secure for sensitive data, but okay for role/id.
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser(payload); // Simplified: assumes token payload is the user object
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setLoading(false);
      return { error: null };
    } catch (error: any) {
      setLoading(false);
      return { error: error.response?.data?.message || "Sign-in failed" };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      await api.post("/auth/register", { email, password, full_name: fullName });
      // Optionally sign in the user directly after registration
      const { data: loginData } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", loginData.token);
      setUser(loginData.user);
      setLoading(false);
      return { error: null };
    } catch (error: any) {
      setLoading(false);
      return { error: error.response?.data?.message || "Sign-up failed" };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
