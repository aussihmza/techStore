import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "@/app/globals.css";
import { StoreProvider } from "@/context/StoreContext";
import Layout from "@/app/layout";
import ScrollToTop from "@/components/layout/ScrollToTop";
import HomePage from "@/app/home/page";
import ShopPage from "@/app/shop/page";
import CategoriesPage from "@/app/categories/page";
import AboutPage from "@/app/about/page";
import ContactPage from "@/app/contact/page";
import WishlistPage from "@/app/wishlist/page";
import CartPage from "@/app/cart/page";
import OrderSuccessPage from "@/app/order-success/page";
import OrdersPage from "@/app/orders/page";
import OrderDetailPage from "@/app/orders/detail/page";
import ProductDetailPage from "@/app/product/page";
import LegalPage from "@/app/legal/page";
import SupportPage from "@/app/support/page";
import LoginPage from "@/app/login/page";
import SignupPage from "@/app/signup/page";
import ForgotPasswordPage from "@/app/forgot-password/page";
import ResetPasswordPage from "@/app/reset-password/page";
import RequireAuth from "@/components/auth/RequireAuth";

const CheckoutPage = lazy(() => import("@/app/checkout/page"));
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <ScrollToTop />
        <StoreProvider>
          <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:categorySlug" element={<ShopPage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:categorySlug" element={<CategoriesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route
              path="/wishlist"
              element={
                <RequireAuth>
                  <WishlistPage />
                </RequireAuth>
              }
            />
            <Route
              path="/cart"
              element={
                <RequireAuth>
                  <CartPage />
                </RequireAuth>
              }
            />
            <Route
              path="/checkout"
              element={
                <RequireAuth>
                  <Suspense
                    fallback={
                      <p className="py-16 text-center text-slate-500">
                        Loading checkout...
                      </p>
                    }
                  >
                    <CheckoutPage />
                  </Suspense>
                </RequireAuth>
              }
            />
            <Route
              path="/order-success"
              element={
                <RequireAuth>
                  <OrderSuccessPage />
                </RequireAuth>
              }
            />
            <Route
              path="/orders"
              element={
                <RequireAuth>
                  <OrdersPage />
                </RequireAuth>
              }
            />
            <Route
              path="/orders/:orderId"
              element={
                <RequireAuth>
                  <OrderDetailPage />
                </RequireAuth>
              }
            />
            <Route path="*" element={<HomePage />} />
          </Route>
          </Routes>
        </StoreProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
);
