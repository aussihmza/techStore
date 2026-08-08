import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoginRequiredModal from "@/components/auth/LoginRequiredModal";
import StripeReturnHandler from "@/components/checkout/StripeReturnHandler";

export default function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col text-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(ellipse_at_top,rgba(37_99_235/0.09),transparent_65%)]"
      />
      <Navbar />
      <main className="relative flex-1">
        <Outlet />
      </main>
      <Footer />
      <LoginRequiredModal />
      <StripeReturnHandler />
    </div>
  );
}
