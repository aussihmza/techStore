import { Outlet } from "react-router-dom";
import Navbar from "@/user/components/layout/Navbar";
import Footer from "@/user/components/layout/Footer";
import LoginRequiredModal from "@/user/components/auth/LoginRequiredModal";
import StripeReturnHandler from "@/user/components/checkout/StripeReturnHandler";
import CookieConsent from "@/user/components/layout/CookieConsent";
import AnalyticsBoot from "@/user/components/layout/AnalyticsBoot";

export default function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col text-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(ellipse_at_top,rgb(37_99_235/0.09),transparent_65%)]"
      />
      <Navbar />
      <main className="relative flex-1">
        <Outlet />
      </main>
      <Footer />
      <LoginRequiredModal />
      <StripeReturnHandler />
      <AnalyticsBoot />
      <CookieConsent />
    </div>
  );
}
