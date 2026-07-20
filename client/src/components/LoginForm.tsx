import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const navigate = useNavigate();

  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    try {
      await login(email, password);

      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;

        if (
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof data.error === "string"
        ) {
          setError(data.error);
        } else {
          setError(error.message);
        }
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Login failed.");
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-12 max-w-md rounded-xl bg-white p-8 shadow dark:bg-gray-800"
    >
      <h1 className="mb-6 text-center text-3xl font-bold dark:text-white">
        Sign In
      </h1>

      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-red-700 dark:border-red-700 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      <label
        htmlFor="email"
        className="mb-2 block font-medium dark:text-white"
      >
        Email
      </label>

      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) =>
          setEmail(event.target.value)
        }
        required
        disabled={loading}
        autoComplete="email"
        className="mb-5 w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800"
      />

      <label
        htmlFor="password"
        className="mb-2 block font-medium dark:text-white"
      >
        Password
      </label>

      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) =>
          setPassword(event.target.value)
        }
        required
        disabled={loading}
        autoComplete="current-password"
        className="mb-6 w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800"
      />

      <button
        type="submit"
        disabled={
          loading ||
          !email.trim() ||
          !password.trim()
        }
        className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Signing In..."
          : "Sign In"}
      </button>
    </form>
  );
}
