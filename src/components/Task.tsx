"use client";

import { useTheme } from "@/contexts/ThemeContext";
import axiosInstance from "@/lib/axiosInstance";
import { deleteTask, updateTask, updateTaskStatus } from "@/services/taskServices";
import { useState } from "react";
import { MdModeEdit, MdDelete } from "react-icons/md";

interface TaskProps {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

interface TaskComponentProps {
  task: TaskProps;
  onUpdate: () => void;
}

export default function Task({ task, onUpdate }: TaskComponentProps) {
  const { theme } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedTask, setEditedTask] = useState<TaskProps>(task);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateTask(task._id, editedTask);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (completed: boolean) => {
    setIsLoading(true);
    try {
      await updateTaskStatus(task._id, completed);
      onUpdate();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task._id);
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  if (isEditing) {
    return (
      <div className="border p-6 rounded-lg shadow-lg bg-white text-gray-800">
        <h3 className="font-bold text-lg mb-4">Edit Task</h3>

        <input
          type="text"
          value={editedTask.title}
          onChange={(e) =>
            setEditedTask({ ...editedTask, title: e.target.value })
          }
          className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
          placeholder="Task Title"
        />

        <textarea
          value={editedTask.description}
          onChange={(e) =>
            setEditedTask({ ...editedTask, description: e.target.value })
          }
          className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
          placeholder="Task Description"
          rows={4}
        />

        <input
          type="date"
          value={editedTask.dueDate.split("T")[0]}
          onChange={(e) =>
            setEditedTask({ ...editedTask, dueDate: e.target.value })
          }
          className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
        />

        <div className="flex space-x-2">
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-500 transition-colors duration-200 ease-in-out"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-400 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex justify-between items-start p-6 rounded-lg shadow-xl ${
        theme === "light"
          ? "bg-gray-100 text-black hover:shadow-gray-500"
          : "bg-gray-800 text-gray-100 hover:shadow-gray-700"
      } transition-all`}
    >
      <div>
        <h3 className="font-bold text-lg mb-2">{task.title}</h3>
        <p className="text-sm mb-4">{task.description}</p>
        <p className="text-xs text-gray-400 mb-4">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleStatusUpdate(!task.completed)}
            className="mr-2 h-5 w-5 text-blue-500 focus:ring-2 focus:ring-blue-400 rounded-lg bg-gray-700 border-gray-600 cursor-pointer"
            disabled={isLoading}
          />
          <label className="text-sm">
            {isLoading
              ? "Loading..."
              : task.completed
              ? "Completed"
              : "Not Completed"}
          </label>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => setIsEditing(true)}
          className="bg-white rounded-full text-gray-900 h-8 w-8 flex items-center justify-center font-semibold hover:bg-yellow-400 transition-colors duration-200 ease-in-out"
        >
          <MdModeEdit size={20} />
        </button>
        <button
          onClick={handleDelete}
          className="bg-white rounded-full text-gray-900 h-8 w-8 flex items-center justify-center font-semibold hover:bg-red-500 transition-colors duration-200 ease-in-out"
          disabled={isLoading}
        >
          <MdDelete size={20} />
        </button>
      </div>
    </div>
  );
}
