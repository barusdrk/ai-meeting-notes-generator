import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      setError(
        error instanceof Error
          ? error.message
          : "Login failed."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-12 max-w-md rounded-xl bg-white p-8 shadow"
    >
      <h1 className="mb-6 text-center text-3xl font-bold">
        Sign In
      </h1>

      {error && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      <label className="mb-2 block">
        Email
      </label>

      <input
        type="email"
        value={email}
        onChange={(event) =>
          setEmail(event.target.value)
        }
        required
        className="mb-5 w-full rounded border p-3"
      />

      <label className="mb-2 block">
        Password
      </label>

      <input
        type="password"
        value={password}
        onChange={(event) =>
          setPassword(
            event.target.value
          )
        }
        required
        className="mb-6 w-full rounded border p-3"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading
          ? "Signing In..."
          : "Sign In"}
      </button>
    </form>
  );
}
