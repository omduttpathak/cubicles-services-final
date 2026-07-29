import { Navigate, Outlet } from "react-router-dom"

import { isAuthenticated } from "@/utils/auth"

export default function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
