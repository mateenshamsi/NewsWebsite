import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

interface Props {
  children: JSX.Element;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<Props> = ({ children, adminOnly = false }) => {
  const { user, token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;