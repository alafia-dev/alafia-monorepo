import { createBrowserRouter, Navigate } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/LoginPage";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPasswordPage";
import { ResetPasswordOTP } from "./pages/OtpReset";
import { ResetPassword } from "./pages/ResetPasswordPage";
import { DashboardRouter } from "./routers/DashboardRouters";
import { PatientDashboard } from "./pages/PatientDashboardPage";
import { DoctorDashboard } from "./pages/DoctorsDashboard";
import { NurseDashboard } from "./pages/NurseDashboard";
import { LabDashboard } from "./pages/LabDashboard";
import { PharmacyDashboard } from "./pages/PharmacyDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password-otp",
    element: <ResetPasswordOTP />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/dashboard",
    element: <Navigate to="/dashboard-router" replace />,
  },
  {
    path: "/dashboard-router",
    element: <DashboardRouter />,
  },
  {
    path: "/dashboard/patient",
    element: <PatientDashboard />,
  },
  {
    path: "/dashboard/doctor",
    element: <DoctorDashboard />,
  },
  { path: "/dashboard/nurse", element: <NurseDashboard /> },
  { path: "/dashboard/lab", element: <LabDashboard /> },
  { path: "/dashboard/pharmacy", element: <PharmacyDashboard /> },
  { path: "/dashboard/admin", element: <AdminDashboard /> },

 
  {
    path: "*",
    element: <Login />,
  },
]);
