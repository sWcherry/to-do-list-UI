import { useState } from "react"
import { Container, TextField, Button, Typography, Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { registerRequest } from "../api/authApi"
import { useAuth } from "../context/AuthContext"

function RegisterPage() {

  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    birth_date: "",
    gender: "",
    password: "",
    password_confirm: "",
  })

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const data = await registerRequest(form)

      await login(data.token)

      navigate("/tasks")
    } catch {
      alert("Registration failed")
    }
  }

  return (
    <Container maxWidth="xs">

      <Box sx={{ mt: 5 }}>

        <Typography variant="h4">
          Sign up
        </Typography>

        <form onSubmit={handleSubmit}>

          <TextField
            label="Email"
            name="email"
            size="small"
            fullWidth
            margin="normal"
            slotProps={{inputLabel: {shrink: true}}}
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            label="Username"
            name="username"
            size="small"
            fullWidth
            margin="dense"
            slotProps={{inputLabel: {shrink: true}}}
            value={form.username}
            onChange={handleChange}
          /> 

          <TextField
            label="First Name"
            name="first_name"
            size="small"
            fullWidth
            margin="normal"
            slotProps={{inputLabel: {shrink: true}}}
            value={form.first_name}
            onChange={handleChange}
          />

          <TextField
            label="Last Name"
            name="last_name"
            size="small"
            fullWidth
            margin="normal"
            slotProps={{inputLabel: {shrink: true}}}
            value={form.last_name}
            onChange={handleChange}
          />

          <TextField
            label="Birth Date"
            type="date"
            name="birth_date"
            size="small"
            fullWidth
            margin="normal"
            slotProps={{inputLabel: {shrink: true}}}
            value={form.birth_date}
            onChange={handleChange}
          />

          <FormControl>
            <FormLabel sx={{ fontSize: "12px", mt: 1, ml: 1.5 }}>Gender</FormLabel>

            <RadioGroup
              row
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <FormControlLabel value="M" control={<Radio size="small"/>} label="Male" sx={{ml: 0}} />
              <FormControlLabel value="F" control={<Radio size="small"/>} label="Female" />
              <FormControlLabel value="O" control={<Radio size="small"/>} label="Other" />
            </RadioGroup>

          </FormControl>

          <TextField
            label="Password"
            type="password"
            name="password"
            size="small"
            fullWidth
            margin="normal"
            slotProps={{inputLabel: {shrink: true}}}
            value={form.password}
            onChange={handleChange}
          />

          <TextField
            label="Confirm Password"
            type="password"
            name="password_confirm"
            size="small"
            fullWidth
            margin="normal"
            slotProps={{inputLabel: {shrink: true}}}
            value={form.password_confirm}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Sign up
          </Button>

        </form>

      </Box>

    </Container>
  )
}

export default RegisterPage