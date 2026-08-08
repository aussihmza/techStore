import { useState } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useStore } from "@/context/StoreContext";

export default function GoogleSignInButton() {
  const { loginWithGoogle } = useStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      setError("Google did not return a valid credential.");
      return;
    }

    setLoading(true);
    setError("");
    const result = await loginWithGoogle(response.credential);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    // Login/Signup page effect runs resumePendingAuthAction + navigate.
  };

  if (!clientId) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Add <code className="font-semibold">VITE_GOOGLE_CLIENT_ID</code> in{" "}
        <code className="font-semibold">frontend/.env</code> (and matching{" "}
        <code className="font-semibold">GOOGLE_CLIENT_ID</code> in backend) to enable Google
        Sign-In.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex w-full justify-center [&_div]:w-full [&_iframe]:!w-full">
        <GoogleLogin
          onSuccess={(res) => void handleSuccess(res)}
          onError={() => setError("Google sign-in was cancelled or failed.")}
          useOneTap={false}
          width="360"
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
          logo_alignment="left"
        />
      </div>

      {loading ? (
        <p className="text-center text-sm text-slate-500">Signing you in...</p>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
