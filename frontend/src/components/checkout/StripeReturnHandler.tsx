import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { orderPathId } from "@/lib/order";

/** Handles return from Stripe Checkout → completes order → order success */
export default function StripeReturnHandler() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { authReady, isLoggedIn, completeCardCheckout } = useStore();
  const [message, setMessage] = useState("");
  const handled = useRef(false);

  const checkout = params.get("checkout");
  const sessionId = params.get("session_id");

  useEffect(() => {
    if (!authReady || handled.current) return;

    if (checkout === "cancel") {
      handled.current = true;
      setParams({}, { replace: true });
      navigate("/checkout", { replace: true });
      return;
    }

    if (checkout !== "success" || !sessionId) return;
    if (!isLoggedIn) return;

    handled.current = true;

    async function finish() {
      setMessage("Confirming your payment...");
      const result = await completeCardCheckout(sessionId!);
      setParams({}, { replace: true });

      if (!result.ok) {
        setMessage(result.error);
        return;
      }

      navigate(`/order-success?id=${orderPathId(result.order.id)}`, {
        replace: true,
      });
    }

    void finish();
  }, [
    authReady,
    isLoggedIn,
    checkout,
    sessionId,
    completeCardCheckout,
    navigate,
    setParams,
  ]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[120] w-[min(92vw,28rem)] -translate-x-1/2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-ink shadow-lg">
      {message}
    </div>
  );
}
