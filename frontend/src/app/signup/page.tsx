import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthShell, { AuthField, authInputClass } from "@/components/auth/AuthShell";
import { useStore } from "@/context/StoreContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isLoggedIn } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  if (isLoggedIn) return <Navigate to="/" replace />;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    const result = signup({
      name: name.trim(),
      email: email.trim(),
      password,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/");
  };

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
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Create a password"
            className={authInputClass}
          />
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
          className="w-full rounded-xl bg-brand px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Create Account
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
