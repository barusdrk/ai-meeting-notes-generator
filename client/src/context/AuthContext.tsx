import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  loginUser,
  registerUser,
  getCurrentUser,
  setAuthToken,
  removeAuthToken,
  type User,
} from "../services/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  register: (
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => void;
}

const AuthContext =
  createContext<AuthContextValue | null>(
    null
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function restoreSession() {
      const token =
        localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setAuthToken(token);

        const currentUser =
          await getCurrentUser();

        setUser(currentUser);
      } catch {
        removeAuthToken();
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(
    email: string,
    password: string
  ) {
    setLoading(true);

    try {
      const response =
        await loginUser(
          email,
          password
        );

      localStorage.setItem(
        "token",
        response.token
      );

      setAuthToken(response.token);

      setUser(response.user);
    } finally {
      setLoading(false);
    }
  }

  async function register(
    email: string,
    password: string
  ) {
    setLoading(true);

    try {
      const response =
        await registerUser(
          email,
          password
        );

      localStorage.setItem(
        "token",
        response.token
      );

      setAuthToken(response.token);

      setUser(response.user);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    removeAuthToken();

    localStorage.removeItem("token");

    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated:
        user !== null,
      login,
      register,
      logout,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider."
    );
  }

  return context;
}
