import { Navigate } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { setAuthReturn } from "@/lib/authRedirect";

/** Blocks non-admins. Backend /api/admin still enforces role. */
export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, authReady, user } = useStore();

  if (!authReady) {
    return <p className="py-16 text-center text-slate-500">Loading...</p>;
  }

  if (!isLoggedIn) {
    setAuthReturn({ returnTo: "/admin" });
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
