import api from "./axios"

export const getTasks = async (params?: any) => {
  const response = await api.get("/tasks/", { params })
  return response.data
}

export const createTask = async (data: any) => {
  const response = await api.post("/tasks/create/", data)
  return response.data
}

export const updateTask = async (id: number, data: any) => {
  const response = await api.patch(`/tasks/${id}/`, data)
  return response.data
}

export const deleteTask = async (id: number) => {
  const response = await api.delete(`/tasks/${id}/`)
  return response.data
}