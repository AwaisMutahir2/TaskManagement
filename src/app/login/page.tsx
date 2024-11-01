"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

export default function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      if (res.status === 200) {
        router.push('/dashboard');
      }
    } catch (error) {
      setError(error?.response?.data?.error)
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 max-w-md mx-auto mt-8 text-black"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="border p-2 rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Login
      </button>
      {error && <p className="text-red-400">Invalid Credentials</p>}
    </form>
  );
}
