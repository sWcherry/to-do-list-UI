import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Box
} from "@mui/material"

import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { useState } from "react"

function TaskList({ tasks, users, onDelete, onUpdate, currentUser }: any) {

  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<any>({})
  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString("uk-UA") : "-"

  const handleEditClick = (task: any) => {
    setEditingId(task.id)
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      assigned_to: task.assigned_to,
      deadline: task.deadline
    })
  }

  const handleSave = async (id: number) => {
    if (onUpdate) {
      await onUpdate(id, formData)
    }
    setEditingId(null)
  }

  return (
    <>
      {tasks.map((task: any) => {
      
      const user = users?.find(
        (u: any) => u.id === task.assigned_to
      )

      const isOwner = task.owner?.id === currentUser?.id

      return (
        <Accordion key={task.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{task.title}</Typography>
          </AccordionSummary>

          <AccordionDetails>

            {editingId === task.id ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                <TextField
                  label="Title"
                  value={formData.title}
                  disabled={!isOwner}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  fullWidth
                />

                <TextField
                  label="Description"
                  value={formData.description}
                  disabled={!isOwner}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  fullWidth
                  multiline
                  rows={3}
                />

                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  size="small"
                >
                  <MenuItem value="Assigned">Assigned</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>

                <Select
                  value={formData.assigned_to || ""}
                  disabled={!isOwner}
                  onChange={(e) =>
                    setFormData({ ...formData, assigned_to: e.target.value })
                  }
                  size="small"
                  fullWidth
                >
                  {users.map((user: any) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.username}
                    </MenuItem>
                  ))}
                </Select>

                <TextField
                  label="Deadline"
                  type="date"
                  disabled={!isOwner}
                  value={formData.deadline?.split("T")[0] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                  fullWidth
                />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleSave(task.id)}
                  >
                    Save
                  </Button>

                  {isOwner && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => onDelete(task.id)}
                    >
                      Delete
                    </Button>
                  )}

                  <Button
                    variant="text"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </Button>
                </Box>

              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography><strong>Description:</strong> {task.description || "-"}</Typography>
                <Typography><strong>Status:</strong> {task.status}</Typography>
                <Typography><strong>Owner:</strong> {task.owner.full_name}</Typography>
                <Typography><strong>Assigned To:</strong> {user?.full_name || "-"}</Typography>
                <Typography><strong>Deadline:</strong> {formatDate(task.deadline)}</Typography>

                <Box sx={{ mt: 1 }}>
                  <Button size="small" onClick={() => handleEditClick(task)}>
                    Edit
                  </Button>

                  {isOwner && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => onDelete(task.id)}
                    >
                      Delete
                    </Button>
                  )}
                </Box>
              </Box>
            )}

          </AccordionDetails>
        </Accordion>
      )})}
    </>
  )
}

export default TaskList