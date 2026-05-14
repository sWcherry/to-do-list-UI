import { Routes, Route } from "react-router-dom"
import AboutPage from "../pages/AboutPage"
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import TasksPage from "../pages/TasksPage"
import ProfilePage from "../pages/ProfilePage"
import ProtectedRoute from "./ProtectedRoute"

function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<AboutPage />} />
      <Route path="/about" element={<AboutPage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

    </Routes>
  )
}

export default AppRoutes