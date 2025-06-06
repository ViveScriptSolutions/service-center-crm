import { AuthForm } from "../auth-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 border rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <AuthForm type="login" />
      </div>
    </div>
  );
}
