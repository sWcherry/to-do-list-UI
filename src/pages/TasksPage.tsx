import { useEffect, useState } from "react"
import { Container, Typography, CircularProgress } from "@mui/material"
import { getTasks, deleteTask, createTask, updateTask } from "../api/tasksApi"
import { useAuth } from "../context/AuthContext"
import TaskList from "../components/tasks/TaskList"
import TaskToolbar from "../components/tasks/TaskToolbar"
import CreateTaskDialog from "../components/tasks/CreateTaskDialog"
import ConfirmDialog from "../components/common/ConfirmDialog"
import SnackbarAlert from "../components/common/SnackbarAlert"

function TasksPage({}: any) {

  const [tasks, setTasks] = useState<any[]>([])
  const users = Array.from(
    new Map(
      tasks
        .flatMap((task: any) => [
          task.owner,
          task.assigned_to
        ])
        .filter(Boolean)
        .map((user: any) => [user.id, user])
    ).values()
  )
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [snackbar, setSnackbar] = useState(false)
  const [filters, setFilters] = useState<any>({
    status: "",
    owner: "",
    assigned_to: "",
    assignedOptions: []
  })

  const loadTasks = async () => {
    setLoading(true)

    const params: any = {}
    if (sort) params.sort = sort
    if (filters.assigned_to) params.assigned_to = filters.assigned_to
    if (filters.status) {
      params.status = filters.status
    }
    if (filters.owner) {
      params.owner = filters.owner
    }
    
    const data = await getTasks(params)
    setTasks(data.results)
    setLoading(false)
  }

  useEffect(() => {
    loadTasks()
  }, [
    sort,
    filters.assigned_to,
    filters.status,
    filters.owner
  ])

  const handleCreate = async (task: any) => {
    await createTask(task)
    setSnackbar(true)
    loadTasks()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteTask(deleteId)
    setDeleteId(null)
    setSnackbar(true)
    loadTasks()
  }

  const handleUpdate = async (id: number, data: any) => {
    await updateTask(id, data)
    setSnackbar(true)
    loadTasks()
  }

  if (loading) return <CircularProgress />

  return (
    <Container>

      <Typography variant="h4" sx={{ mt: 4 }}>
        Tasks
      </Typography>

      <TaskToolbar
        onCreate={() => setCreateOpen(true)}
        sort={sort}
        setSort={setSort}
        filters={filters}
        setFilters={setFilters}
      />

      <TaskList
        tasks={tasks}
        users={users}
        currentUser={user}
        onDelete={(id: number) => setDeleteId(id)}
        onUpdate={handleUpdate}
      />

      <CreateTaskDialog
        users={users}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />

      <SnackbarAlert
        open={snackbar}
        message="Action successful"
        onClose={() => setSnackbar(false)}
      />

    </Container>
  )
}

export default TasksPage