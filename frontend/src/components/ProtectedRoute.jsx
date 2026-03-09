import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === "ADMIN" ? "/admin" : "/faculty"} replace />;

  return children;
}