import { useState } from "react"
import { Box, TextField, Button, MenuItem } from "@mui/material"

const genders = [
  { value: "M", label: "Чоловіча" },
  { value: "F", label: "Жіноча" },
  { value: "O", label: "Інше" }
]

function ProfileForm({ profile, onSave, onCancel }: any) {

  const [form, setForm] = useState(profile)

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    onSave(form)
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
      <TextField label="First Name" name="first_name" value={form.first_name} onChange={handleChange} />
      <TextField label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} />
      <TextField label="Gender" name="gender" select value={form.gender} onChange={handleChange}>
        {genders.map(g => <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>)}
      </TextField>
      <TextField label="Birth Date" name="birth_date" type="date" slotProps={{inputLabel: {shrink: true}}} value={form.birth_date || ""} onChange={handleChange} />
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
        <Button variant="outlined" onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  )
}

export default ProfileForm