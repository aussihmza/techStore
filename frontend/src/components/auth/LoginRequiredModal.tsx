import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { clearAuthReturn, peekAuthReturn } from "@/lib/authRedirect";
import { UserIcon } from "@/components/ui/icons";

export default function LoginRequiredModal() {
  const { loginPromptOpen, closeLoginPrompt } = useStore();
  const intent = loginPromptOpen ? peekAuthReturn() : null;
  const isBuyNow = intent?.action === "buyNow";

  if (!loginPromptOpen) return null;

  const dismiss = () => {
    clearAuthReturn();
    closeLoginPrompt();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-required-title"
      onClick={dismiss}
    >
      <div
        className="w-full max-w-md animate-fade-up rounded-[1.5rem] border border-white/70 bg-white/95 p-8 shadow-2xl backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
          <UserIcon className="h-6 w-6" />
        </span>

        <h2
          id="login-required-title"
          className="font-display mt-5 text-2xl font-extrabold text-ink"
        >
          {isBuyNow ? "Log in to checkout" : "You are not logged in"}
        </h2>
        <p className="section-sub mt-2 text-base">
          {isBuyNow
            ? "Sign in and we’ll take you straight to checkout with this item."
            : "Please log in first to use wishlist and cart features."}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/login" onClick={closeLoginPrompt} className="btn-primary flex-1">
            Go to Login
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="btn-secondary flex-1"
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
