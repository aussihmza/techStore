import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoginRequiredModal from "@/components/auth/LoginRequiredModal";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-ink">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <LoginRequiredModal />
    </div>
  );
}
