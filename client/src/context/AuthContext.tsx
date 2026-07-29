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

  login(
    email: string,
    password: string
  ): Promise<void>;

  register(
    email: string,
    password: string
  ): Promise<void>;

  logout(): void;
}


const AuthContext =
  createContext<AuthContextValue | null>(
    null
  );


export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

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
        localStorage.removeItem(
          "token"
        );

        removeAuthToken();

        setUser(null);

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

    const response =
      await loginUser(
        email,
        password
      );


    localStorage.setItem(
      "token",
      response.token
    );


    setAuthToken(
      response.token
    );


    setUser(
      response.user
    );
  }


  async function register(
    email: string,
    password: string
  ) {

    const response =
      await registerUser(
        email,
        password
      );


    localStorage.setItem(
      "token",
      response.token
    );


    setAuthToken(
      response.token
    );


    setUser(
      response.user
    );
  }


  function logout() {

    localStorage.removeItem(
      "token"
    );


    removeAuthToken();


    setUser(null);
  }


  const value =
    useMemo(
      () => ({
        user,
        loading,
        isAuthenticated:
          Boolean(user),

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
      "useAuth must be used inside AuthProvider."
    );
  }


  return context;
}
