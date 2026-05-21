import { useState } from "react"
import { Container, TextField, Button, Typography, Box } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { loginRequest } from "../api/authApi"
import { useAuth } from "../context/AuthContext"

function LoginPage() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const data = await loginRequest(email, password)

      await login(data.token)
      console.log("login success")

      navigate("/tasks")
    } catch (error) {
      alert("Login failed")
    }
  }

  return (
    <Container maxWidth="xs">

      <Box sx={{ mt: 5 }}>

        <Typography variant="h4" gutterBottom>
          Log in
        </Typography>

        <form onSubmit={handleSubmit}>

          <TextField
            label="Email"
            name="email"
            size="small"
            fullWidth
            margin="normal"
            slotProps={{inputLabel: {shrink: true}}}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            size="small"
            fullWidth
            margin="normal"
            slotProps={{inputLabel: {shrink: true}}}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Log in
          </Button>

        </form>

      </Box>

    </Container>
  )
}

export default LoginPage