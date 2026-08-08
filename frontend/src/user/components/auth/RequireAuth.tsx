import { Navigate, useLocation } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { setAuthReturn } from "@/lib/authRedirect";

/** Redirect guests to login and restore this page after auth. */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, authReady } = useStore();
  const location = useLocation();

  if (!authReady) {
    return <p className="py-16 text-center text-slate-500">Loading...</p>;
  }

  if (!isLoggedIn) {
    setAuthReturn({
      returnTo: `${location.pathname}${location.search}`,
    });
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
