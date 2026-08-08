import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import AuthShell, { AuthField, authInputClass } from "@/user/components/auth/AuthShell";
import { useStore } from "@/context/StoreContext";
import { resetPasswordApi } from "@/user/api/auth";
import { ApiError } from "@/lib/api/client";
import {
  isStrongPassword,
  PASSWORD_REQUIREMENTS_MESSAGE,
} from "@/lib/password";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const { isLoggedIn, authReady } = useStore();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (authReady && isLoggedIn) return <Navigate to="/" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Reset session is missing. Verify OTP again from forgot password.");
      return;
    }

    if (!isStrongPassword(password)) {
      setError(PASSWORD_REQUIREMENTS_MESSAGE);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await resetPasswordApi(token, password);
      setDone(true);
      window.setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not reset password. Please verify OTP again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      mode="reset"
      title="Set new password"
      subtitle="Choose a new password for your TechStore account."
    >
      {!token ? (
        <div className="space-y-5">
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            Reset session is missing. Please request a new OTP.
          </p>
          <Link
            to="/forgot-password"
            className="btn-primary w-full"
          >
            Request OTP
          </Link>
        </div>
      ) : done ? (
        <div className="space-y-5">
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Password updated successfully. Redirecting to login...
          </p>
          <Link
            to="/login"
            className="btn-primary w-full"
          >
            Go to login
          </Link>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <AuthField label="New Password" htmlFor="reset-password">
            <input
              id="reset-password"
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

          <AuthField label="Confirm Password" htmlFor="reset-confirm">
            <input
              id="reset-confirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
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
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
