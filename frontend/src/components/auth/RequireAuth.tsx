import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "@/context/StoreContext";

/** Redirect guests to home and open the login popup. */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, authReady, openLoginPrompt } = useStore();

  useEffect(() => {
    if (authReady && !isLoggedIn) openLoginPrompt();
  }, [authReady, isLoggedIn, openLoginPrompt]);

  if (!authReady) {
    return <p className="py-16 text-center text-slate-500">Loading...</p>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
