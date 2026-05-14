import { createContext, useContext, useState, useEffect } from "react"
import { getProfile } from "../api/authApi"

interface AuthContextType {
  user: any
  isAuthenticated: boolean
  login: (token: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: any) => {

  const [user, setUser] = useState(null)

  const token = localStorage.getItem("token")

  const login = async (token: string) => {
    localStorage.setItem("token", token)
    console.log("user:", user)
    await fetchUser()
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  const fetchUser = async () => {
    try {
      const data = await getProfile()
      setUser(data)
    } catch {
      logout()
    }
  }

  useEffect(() => {
    if (token) {
      fetchUser()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)!
}