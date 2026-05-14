import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function ProtectedRoute({ children }: any) {
  const { isAuthenticated } = useAuth()

  console.log("isAuthenticated:", isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute