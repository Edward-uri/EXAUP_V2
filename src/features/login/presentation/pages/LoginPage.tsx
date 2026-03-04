import { LoginForm } from "../components/LoginForm";
import { useLogin } from "../hooks/useLogin";

export default function LoginPage() {
  const { loading, error, login } = useLogin();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-blue-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-4">
        <div className="flex justify-center mb-1">
          <img
            src="/EXAUP.svg"
            alt="EXAUP"
            className="h-10 w-auto drop-shadow-sm"
          />
        </div>

        <LoginForm
          loading={loading}
          error={error}
          onSubmit={(email, password) => login(email, password)}
        />
      </div>
    </div>
  );
}
