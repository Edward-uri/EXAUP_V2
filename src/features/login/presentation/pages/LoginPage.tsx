import { LoginForm } from "../components/LoginForm";
import { useLogin } from "../hooks/useLogin";
import { Brand } from "../../../../shared/components/Brand";

export default function LoginPage() {
  const { loading, error, login } = useLogin();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center mb-1">
          <Brand />
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
