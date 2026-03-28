import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const roleRoutes: Record<string, string> = {
  patient: "/dashboard/patient",
  doctor: "/dashboard/doctor",
  nurse: "/dashboard/nurse",
  lab: "/dashboard/lab",
  pharmacy: "/dashboard/pharmacy",
  admin: "/dashboard/admin",
};

export function DashboardRouter() {
  const { token, role } = useAuthStore();

  if (!token) return <Navigate to="/login" replace />;

  if (role && roleRoutes[role]) return <Navigate to={roleRoutes[role]} replace />;

  return <Navigate to="/login" replace />;
}