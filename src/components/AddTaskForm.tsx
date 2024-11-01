"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";

interface AddTaskFormProps {
  setToggleFetch: React.Dispatch<React.SetStateAction<number>>;
}

export default function AddTaskForm({ setToggleFetch }: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/tasks", {
        title,
        description,
        dueDate,
      });
      setTitle("");
      setDescription("");
      setDueDate("");
      setToggleFetch((prev: any) => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-6 bg-white rounded-lg shadow-md text-gray-800"
    >
      <h3 className="font-bold text-lg mb-4">Add New Task</h3>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        required
        className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150"
      />

      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150"
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
        className="border border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150"
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-500 transition-colors duration-200 ease-in-out"
      >
        Add Task
      </button>
    </form>
  );
}
