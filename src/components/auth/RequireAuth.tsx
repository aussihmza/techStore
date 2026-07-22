import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "@/context/StoreContext";

/** Redirect guests to home and open the login popup. */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, openLoginPrompt } = useStore();

  useEffect(() => {
    if (!isLoggedIn) openLoginPrompt();
  }, [isLoggedIn, openLoginPrompt]);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
