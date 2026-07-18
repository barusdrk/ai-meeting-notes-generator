import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } =
    useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-lg border px-4 py-2 transition hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {theme === "dark"
        ? "☀️ Light"
        : "🌙 Dark"}
    </button>
  );
}
