import api from "./axios";

export const loginRequest = async (email: string, password: string) => {
  const response = await api.post("/auth/login/", {
    email,
    password
  });

  return response.data;
}

export const registerRequest = async (data: any) => {
  const response = await api.post("/auth/register/", data);

  return response.data;
}

export const getProfile = async () => {
  const response = await api.get("/auth/profile/");
  return response.data;
}

export const updateProfile = async (data: any) => {
  try {
    const res = await api.patch("/auth/profile/", data);
    return res.data;
  } catch (error: any) {
    console.log("PROFILE UPDATE ERROR:", error.response?.data);
    throw error;
  }
}

export const logout = (): void => {
  localStorage.removeItem("authToken");
}

export const deleteProfile = async () => {
  const response = await api.delete("/auth/profile/");
  localStorage.removeItem("authToken");
  return response.data;
}