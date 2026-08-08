import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell, { AuthField, authInputClass } from "@/user/components/auth/AuthShell";
import { useStore } from "@/context/StoreContext";
import {
  isStrongPassword,
  PASSWORD_REQUIREMENTS_MESSAGE,
} from "@/lib/password";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isLoggedIn, authReady, resumePendingAuthAction } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
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
    setError("");

    if (!isStrongPassword(password)) {
      setError(PASSWORD_REQUIREMENTS_MESSAGE);
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await signup({
      name: name.trim(),
      email: email.trim(),
      password,
    });
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
      mode="signup"
      title="Create an Account"
      subtitle="Join TechStore and build your premium tech collection."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthField label="Full Name" htmlFor="signup-name">
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className={authInputClass}
          />
        </AuthField>

        <AuthField label="Email Address" htmlFor="signup-email">
          <input
            id="signup-email"
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

        <AuthField label="Password" htmlFor="signup-password">
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="e.g. Store@123"
            className={authInputClass}
          />
          <p className="mt-1.5 text-xs text-slate-400">
            Min 8 chars, with uppercase, lowercase, digit, and special character.
          </p>
        </AuthField>

        <AuthField label="Confirm Password" htmlFor="signup-confirm">
          <input
            id="signup-confirm"
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              setError("");
            }}
            placeholder="Repeat your password"
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
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand hover:underline">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}
