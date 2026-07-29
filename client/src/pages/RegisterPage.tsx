import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
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
      <RegisterForm />
    </main>
  );
}
