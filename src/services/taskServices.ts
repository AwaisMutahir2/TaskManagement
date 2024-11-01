import axiosInstance from "@/lib/axiosInstance";

export const createTask = async (taskData: {
  title: string;
  description: string;
  dueDate: string;
}) => {
  return await axiosInstance.post("/tasks", taskData);
};

export const updateTask = async (taskId: string, taskData: any) => {
  return await axiosInstance.put(`/tasks/${taskId}`, taskData);
};

export const updateTaskStatus = async (taskId: string, completed: boolean) => {
  return await axiosInstance.patch(`/tasks/${taskId}`, { completed });
};

export const deleteTask = async (taskId: string) => {
  return await axiosInstance.delete(`/tasks/${taskId}`);
};

export const fetchTasks = async (
  page: number,
  filter: string,
  sortBy: string,
  searchTerm: string
) => {
  const res = await fetch(
    `/api/tasks?page=${page}&filter=${filter}&sort=${sortBy}&search=${searchTerm}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  if (res.ok) {
    return await res.json();
  }
  throw new Error("Failed to fetch tasks");
};
