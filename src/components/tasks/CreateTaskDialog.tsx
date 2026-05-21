import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Select,
  MenuItem
} from "@mui/material"

import { useState } from "react"

function CreateTaskDialog({ users, open, onClose, onCreate }: any) {

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [deadline, setDeadline] = useState("")

  const handleSubmit = async () => {

    await onCreate({
      title,
      description,
      assigned_to: assignedTo || null,
      deadline: deadline || null
    })

    setTitle("")
    setDescription("")
    setAssignedTo("")
    setDeadline("")
    onClose()
  }

  return (

    <Dialog open={open} onClose={onClose}>

      <DialogTitle>Create Task</DialogTitle>

      <DialogContent>

        <TextField
          label="Title"
          name="title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          label="Description"
          name="description"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          displayEmpty
          fullWidth
          size="small"
        >
          <MenuItem value="">
            <em>Unassigned</em>
          </MenuItem>

          {users.map((user: any) => (
            <MenuItem key={user.id} value={user.id}>
              {user.username}
            </MenuItem>
          ))}
        </Select>

        <TextField
          label="Deadline"
          type="date"
          fullWidth
          margin="normal"
          slotProps={{
            inputLabel: { shrink: true }
          }}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Create
        </Button>

      </DialogContent>

    </Dialog>
  )
}

export default CreateTaskDialog