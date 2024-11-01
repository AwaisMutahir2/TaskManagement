"use client";

import { useState, useEffect } from "react";
import Task from "./Task";

interface TaskProps {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

interface TaskListProps {
  toggleFetch: number;
}

const TaskList: React.FC<TaskListProps> = ({ toggleFetch }) => {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [page, filter, sortBy, searchTerm, toggleFetch]);

  const fetchTasks = async () => {
    const res = await fetch(
      `/api/tasks?page=${page}&filter=${filter}&sort=${sortBy}&search=${searchTerm}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    if (res.ok) {
      const data = await res.json();
      setTasks(data.tasks);
    }
  };

  return (
    <div className="rounded-lg shadow-md text-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-white">Task List</h2>
      <div className="mb-4 flex flex-col sm:flex-row items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tasks"
          className="p-3 border border-gray-300 rounded-lg mr-2 mb-2 sm:mb-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />
        <select
          onChange={(e) => setFilter(e.target.value)}
          className="mr-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
        <select
          onChange={(e) => setSortBy(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <Task key={task._id} task={task} onUpdate={fetchTasks} />
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-500 transition-colors duration-200 ease-in-out"
        >
          Previous Page
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-500 transition-colors duration-200 ease-in-out"
        >
          Next Page
        </button>
      </div>
    </div>
  );
};

export default TaskList;
