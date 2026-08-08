import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AuthShell, { AuthField, authInputClass } from "@/components/auth/AuthShell";
import OtpModal from "@/components/auth/OtpModal";
import { useStore } from "@/context/StoreContext";
import { forgotPasswordApi, verifyResetOtpApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { isLoggedIn, authReady } = useStore();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  if (authReady && isLoggedIn) return <Navigate to="/" replace />;

  const sendOtp = async (targetEmail: string) => {
    await forgotPasswordApi(targetEmail);
    setOtpOpen(true);
    setOtpError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await sendOtp(email.trim());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (otp: string) => {
    setOtpLoading(true);
    setOtpError("");

    try {
      const data = await verifyResetOtpApi(email.trim(), otp);
      setOtpOpen(false);
      navigate(`/reset-password?token=${encodeURIComponent(data.resetToken)}`, {
        replace: true,
      });
    } catch (err) {
      setOtpError(
        err instanceof ApiError ? err.message : "Could not verify OTP.",
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResend = async () => {
    setOtpLoading(true);
    setOtpError("");
    try {
      await sendOtp(email.trim());
    } catch (err) {
      setOtpError(
        err instanceof ApiError ? err.message : "Could not resend OTP.",
      );
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <AuthShell
      mode="forgot"
      title="Forgot password"
      subtitle="Enter your email and we'll send a one-time code."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthField label="Email Address" htmlFor="forgot-email">
          <input
            id="forgot-email"
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

        {error && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-brand px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>

      <OtpModal
        open={otpOpen}
        email={email.trim()}
        loading={otpLoading}
        error={otpError}
        onClose={() => setOtpOpen(false)}
        onVerify={(otp) => void handleVerify(otp)}
        onResend={() => void handleResend()}
      />
    </AuthShell>
  );
}
