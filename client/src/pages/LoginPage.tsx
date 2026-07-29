import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <main
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-gray-100
        dark:bg-gray-900
      "
    >
      <LoginForm />
    </main>
  );
}
