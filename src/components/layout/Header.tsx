import { AppBar, Toolbar, Typography, Button } from "@mui/material"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

function Header() {

  const { isAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <AppBar position="static">
      <Toolbar>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          To-Do List
        </Typography>

        {!isAuthenticated && (
          <>
            <Button color="inherit" component={Link} to="/about">
              About
            </Button>

            <Button color="inherit" component={Link} to="/login">
              Log in
            </Button>

            <Button color="inherit" component={Link} to="/register">
              Sign up
            </Button>
          </>
        )}

        {isAuthenticated && (
          <>
            <Button color="inherit" component={Link} to="/tasks">
              Tasks
            </Button>

            <Button color="inherit" component={Link} to="/profile">
              Profile
            </Button>

            <Button color="inherit" component={Link} to="/about">
              About
            </Button>

            <Button color="inherit" onClick={handleLogout}>
              Log out
            </Button>
          </>
        )}

      </Toolbar>
    </AppBar>
  )
}

export default Header