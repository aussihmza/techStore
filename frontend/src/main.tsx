import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "@/styles/globals.css";
import { StoreProvider } from "@/context/StoreContext";
import Layout from "@/user/pages/layout";
import ScrollToTop from "@/user/components/layout/ScrollToTop";
import HomePage from "@/user/pages/home/page";
import ShopPage from "@/user/pages/shop/page";
import CategoriesPage from "@/user/pages/categories/page";
import AboutPage from "@/user/pages/about/page";
import ContactPage from "@/user/pages/contact/page";
import WishlistPage from "@/user/pages/wishlist/page";
import CartPage from "@/user/pages/cart/page";
import OrderSuccessPage from "@/user/pages/order-success/page";
import OrdersPage from "@/user/pages/orders/page";
import OrderDetailPage from "@/user/pages/orders/detail/page";
import ProductDetailPage from "@/user/pages/product/page";
import LegalPage from "@/user/pages/legal/page";
import SupportPage from "@/user/pages/support/page";
import LoginPage from "@/user/pages/login/page";
import SignupPage from "@/user/pages/signup/page";
import ForgotPasswordPage from "@/user/pages/forgot-password/page";
import ResetPasswordPage from "@/user/pages/reset-password/page";
import RequireAuth from "@/user/components/auth/RequireAuth";
import RequireAdmin from "@/admin/components/RequireAdmin";
import AdminShell from "@/admin/components/AdminShell";
import AdminDashboardPage from "@/admin/pages/DashboardPage";
import AdminProductsPage from "@/admin/pages/ProductsPage";
import AdminOrdersPage from "@/admin/pages/OrdersPage";
import AdminReviewsPage from "@/admin/pages/ReviewsPage";
import AdminReturnsPage from "@/admin/pages/ReturnsPage";

const CheckoutPage = lazy(() => import("@/user/pages/checkout/page"));
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <ScrollToTop />
        <StoreProvider>
          <Routes>
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminShell />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="returns" element={<AdminReturnsPage />} />
          </Route>
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
