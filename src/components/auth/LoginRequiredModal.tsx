import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { UserIcon } from "@/components/ui/icons";

export default function LoginRequiredModal() {
  const { loginPromptOpen, closeLoginPrompt } = useStore();

  if (!loginPromptOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-required-title"
      onClick={closeLoginPrompt}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
          <UserIcon className="h-6 w-6" />
        </span>

        <h2 id="login-required-title" className="mt-5 text-2xl font-extrabold text-ink">
          You are not logged in
        </h2>
        <p className="mt-2 text-base text-slate-500">
          Please log in first to use wishlist and cart features.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/login"
            onClick={closeLoginPrompt}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-brand px-5 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Go to Login
          </Link>
          <button
            type="button"
            onClick={closeLoginPrompt}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            onClick={closeLoginPrompt}
            className="font-semibold text-brand hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
