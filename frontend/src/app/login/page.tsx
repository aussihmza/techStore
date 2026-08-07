import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthShell, { AuthField, authInputClass } from "@/components/auth/AuthShell";
import { useStore } from "@/context/StoreContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isLoggedIn) return <Navigate to="/" replace />;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/");
  };

  return (
    <AuthShell
      mode="login"
      title="Welcome Back"
      subtitle="Access your premium tech collection."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthField label="Email Address" htmlFor="login-email">
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="name@company.com"
            className={authInputClass}
          />
        </AuthField>

        <AuthField
          label="Password"
          htmlFor="login-password"
          action={
            <button type="button" className="text-sm font-medium text-brand hover:underline">
              Forgot Password?
            </button>
          }
        >
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="••••••••"
            className={authInputClass}
          />
        </AuthField>

        {error && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-xl bg-brand px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Continue to TechStore
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{" "}
        <Link to="/signup" className="font-semibold text-brand hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
