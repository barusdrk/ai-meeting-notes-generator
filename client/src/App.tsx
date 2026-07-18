import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 transition-colors dark:bg-gray-900 dark:text-white">
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate
                to="/"
                replace
              />
            ) : (
              <LoginForm />
            )
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate
                to="/"
                replace
              />
            ) : (
              <RegisterForm />
            )
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </div>
  );
}
