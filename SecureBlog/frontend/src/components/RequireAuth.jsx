import { Navigate } from "react-router-dom";

export default function RequireAuth({ roles, children }) {
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toLowerCase();

  if (!token) return <Navigate to="/login" replace />;
  if (roles && roles.length && role !== "admin" && !roles.includes(role)) {
    return <Navigate to="/splash" replace />;
  }
  return children;
}
