"use client";
import { Suspense, useState } from "react";
import TaskList from "@/components/TaskList";
import AddTaskForm from "@/components/AddTaskForm";
import ThemeToggle from "@/components/ThemeToggle";
import LogoutButton from "@/components/LogoutButton";
import { useTheme } from "@/contexts/ThemeContext";

export default function Dashboard() {
  const { theme } = useTheme();
  const [toggleFetch, setToggleFetch] = useState(0);
  return (
    <div className={`p-4 px-10 min-h-screen ${theme === "light" && "bg-white text-black"}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Dashboard</h1>
        <div className="flex gap-x-4">
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
      <AddTaskForm setToggleFetch={setToggleFetch} />
      <Suspense fallback={<div>Loading tasks...</div>}>
        <TaskList toggleFetch={toggleFetch} />
      </Suspense>
    </div>
  );
}
