import {
  Card,
  CardContent,
  Typography,
  Button,
  Collapse
} from "@mui/material"

import { useState } from "react"

function TaskItem({ task, onDelete }: any) {

  const [open, setOpen] = useState(false)

  return (

    <Card sx={{ mt: 2 }}>

      <CardContent>

        <Typography variant="h6">
          {task.title}
        </Typography>

        <Typography variant="body2">
          Status: {task.status}
        </Typography>

        <Typography variant="body2">
          Deadline: {task.deadline || "—"}
        </Typography>

        <Button
          onClick={() => setOpen(!open)}
          sx={{ mt: 1 }}
        >
          Details
        </Button>

        <Collapse in={open}>

          <Typography sx={{ mt: 2 }}>
            {task.description}
          </Typography>

          <Typography>
            Owner: {task.owner?.username}
          </Typography>

          <Typography>
            Assigned: {task.assigned_to?.username || "—"}
          </Typography>

          <Button
            color="error"
            onClick={() => onDelete(task.id)}
            sx={{ mt: 1 }}
          >
            Delete
          </Button>

        </Collapse>

      </CardContent>

    </Card>

  )
}

export default TaskItem