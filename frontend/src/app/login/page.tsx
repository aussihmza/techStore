import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell, { AuthField, authInputClass } from "@/components/auth/AuthShell";
import { useStore } from "@/context/StoreContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoggedIn, authReady, resumePendingAuthAction } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (!authReady || !isLoggedIn || redirectedRef.current) return;
    redirectedRef.current = true;
    void resumePendingAuthAction().then((path) => {
      navigate(path, { replace: true });
    });
  }, [authReady, isLoggedIn, resumePendingAuthAction, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
    }
    // Redirect handled by effect after session is applied.
  };

  if (authReady && isLoggedIn) {
    return <p className="py-16 text-center text-slate-500">Taking you back...</p>;
  }

  return (
    <AuthShell
      mode="login"
      title="Welcome Back"
      subtitle="Access your premium tech collection."
    >
      <form className="space-y-5" onSubmit={(e) => void handleSubmit(e)}>
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
            <Link to="/forgot-password" className="text-sm font-medium text-brand hover:underline">
              Forgot Password?
            </Link>
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
          disabled={loading}
          className="btn-primary w-full disabled:opacity-60 disabled:hover:transform-none"
        >
          {loading ? "Signing in..." : "Continue to TechStore"}
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
