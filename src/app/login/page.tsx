"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { login } from "@/services/authServices";
import { AxiosError } from "axios";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";

type ErrorResponse = { error?: string };

export default function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      if (res.status === 200) {
        router.push("/dashboard");
      }
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      setError(err.response?.data?.error || "An unknown error occurred");
      console.error(error);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 min-w-[20rem] mt-8 text-black"
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
        <div className="text-white flex justify-end gap-x-2">
          <p>Don't have an account?</p>
          <Link className="underline hover:text-gray-300" href={"/register"}>Register</Link>
        </div>
      </form>
      <Link
        href={"/"}
        className="absolute top-10 left-10 bg-white text-black h-8 w-8 flex items-center justify-center rounded-full cursor-pointer shadow-lg transition-all duration-200 transform hover:shadow-xl hover:-translate-y-1 active:scale-95"
      >
        <FaAngleLeft size={24} />
      </Link>
    </div>
  );
}
