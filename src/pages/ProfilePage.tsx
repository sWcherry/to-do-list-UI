import { useState, useEffect } from "react"
import { Container, Typography, Button, Box, CircularProgress, Avatar, Table, TableBody, TableRow, TableCell } from "@mui/material"
import ProfileForm from "../components/profile/ProfileForm"
import ConfirmDialog from "../components/common/ConfirmDialog"
import SnackbarAlert from "../components/common/SnackbarAlert"
import { getProfile, updateProfile, deleteProfile } from "../api/authApi"
import { logout } from "../api/authApi"
import { useAuth } from "../context/AuthContext"

function ProfilePage() {

  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "" })
  const onLogout = useAuth().logout // ?
  const genderLabels: Record<string, string> = {
    M: "Male",
    F: "Female",
    O: "Other"
  }
  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString("uk-UA") : "-"

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setLoading(true)
    const data = await getProfile()
    setProfile(data)
    setLoading(false)
  }

  const handleUpdate = async (updated: any) => {
    await updateProfile(updated)
    setSnackbar({ open: true, message: "Profile updated" })
    setEditMode(false)
    loadProfile()
  }

  const handleLogout = async () => {
    await logout
    onLogout()
  }

  const handleDelete = async () => {
    await deleteProfile()
    setConfirmDelete(false)
    onLogout() 
  }

  if (loading) return <CircularProgress />

  return (
    <Container sx={{ mt: 4 }}>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Profile</Typography>
        <Button variant="outlined" color="error" onClick={() => setConfirmDelete(true)}>
          Delete Account
        </Button>
      </Box>

      {!editMode ? (
        <Box>
          <Avatar sx={{ width: 100, height: 100, mb: 2}}>{profile.avatar}</Avatar>
          <Box sx={{ maxWidth: 600 }}>
            <Table size="small" sx={{ "& .MuiTableCell-root": { fontSize: "16px", py: 1 }}}>
              <TableBody>
                <TableRow>
                  <TableCell><strong>Username</strong></TableCell>
                  <TableCell>{profile.username}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell>{profile.email}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><strong>First Name</strong></TableCell>
                  <TableCell>{profile.first_name}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><strong>Last Name</strong></TableCell>
                  <TableCell>{profile.last_name}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><strong>Gender</strong></TableCell>
                  <TableCell>{genderLabels[profile.gender] || "-"}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><strong>Birth Date</strong></TableCell>
                  <TableCell>{formatDate(profile.birth_date) || "-"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>

          <Button variant="contained" sx={{ mt: 2, mr: 2 }} onClick={() => setEditMode(true)}>
            Edit Profile
          </Button>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={handleLogout}>
            Log out
          </Button>
        </Box>
      ) : (
        <ProfileForm profile={profile} onCancel={() => setEditMode(false)} onSave={handleUpdate} />
      )}

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be undone."
      />

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />

    </Container>
  )
}

export default ProfilePage