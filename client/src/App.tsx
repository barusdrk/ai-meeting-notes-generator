import {Routes,Route,Navigate} from "react-router-dom";

import {useAuth} from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import MeetingHistoryPage from "./pages/MeetingHistoryPage";
import MeetingDetailsPage from "./pages/MeetingDetailsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ReportsPage from "./pages/ReportsPage";
import PricingPage from "./pages/PricingPage";
import BillingPage from "./pages/BillingPage";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App(){

  const {
    isAuthenticated,
  }=useAuth();

  return(
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated
            ? <Navigate to="/" replace/>
            : <LoginPage/>
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated
            ? <Navigate to="/" replace/>
            : <RegisterPage/>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/meetings"
          element={
            <ProtectedRoute>
              <MeetingHistoryPage/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/meetings/:id"
          element={
            <ProtectedRoute>
              <MeetingDetailsPage/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/pricing"
          element={<PricingPage/>}
        />

        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <BillingPage/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard/>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate to="/" replace/>
          }
        />
      </Routes>
    </div>
  );
}
