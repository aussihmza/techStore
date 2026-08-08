import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { calcCartTotals } from "@/lib/cart";
import { createCheckoutSessionApi } from "@/lib/api/payments";
import { ApiError } from "@/lib/api/client";
import type { ShippingInfo } from "@/types/order";
import type { PaymentMethodOption } from "@/lib/api/orders";
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary";
import OrderPlacedModal from "@/components/checkout/OrderPlacedModal";
import {
  FormField,
  PaymentOption,
  SelectInput,
  StepSection,
  TextInput,
} from "@/components/checkout/CheckoutForms";

function readShipping(form: HTMLFormElement): ShippingInfo {
  const data = new FormData(form);
  return {
    firstName: String(data.get("firstName") ?? ""),
    lastName: String(data.get("lastName") ?? ""),
    email: String(data.get("email") ?? ""),
    address: String(data.get("address") ?? ""),
    city: String(data.get("city") ?? ""),
    state: String(data.get("state") ?? ""),
    zip: String(data.get("zip") ?? ""),
  };
}

export default function CheckoutPage() {
  const { cart, placeOrder } = useStore();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodOption>("cod");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");

  const { subtotal, taxes, total } = useMemo(() => {
    const sub = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    return calcCartTotals(sub);
  }, [cart]);

  if (cart.length === 0 && !successOpen) {
    return <Navigate to="/cart" replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const shipping = readShipping(e.currentTarget);

    try {
      if (paymentMethod === "card") {
        const session = await createCheckoutSessionApi(shipping);
        if (!session.url) {
          throw new Error("Stripe checkout URL missing");
        }
        window.location.href = session.url;
        return;
      }

      const result = await placeOrder(shipping, "cod");
      if (!result.ok) {
        setError(result.error);
        setLoading(false);
        return;
      }

      setPlacedOrderId(result.order.id);
      setSuccessOpen(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Checkout failed.",
      );
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
      <nav className="pt-6 text-base text-slate-400">
        <Link to="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/cart" className="hover:text-brand">
          Cart
        </Link>
        <span className="mx-2">/</span>
        <span className="text-brand">Checkout</span>
      </nav>

      <h1 className="mb-8 mt-2 text-3xl font-bold text-ink sm:text-4xl">Checkout</h1>

      {error && (
        <p className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="grid gap-8 pb-16 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <StepSection step={1} title="Shipping Information">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="First Name">
                <TextInput name="firstName" required placeholder="John" />
              </FormField>
              <FormField label="Last Name">
                <TextInput name="lastName" required placeholder="Doe" />
              </FormField>
              <FormField label="Email Address" className="sm:col-span-2">
                <TextInput name="email" required type="email" placeholder="john@example.com" />
              </FormField>
              <FormField label="Street Address" className="sm:col-span-2">
                <TextInput name="address" required placeholder="123 Tech Avenue" />
              </FormField>
              <FormField label="City">
                <TextInput name="city" required placeholder="San Francisco" />
              </FormField>
              <FormField label="State">
                <SelectInput name="state" required defaultValue="">
                  <option value="" disabled>
                    Select state
                  </option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                  <option value="PB">Punjab</option>
                </SelectInput>
              </FormField>
              <FormField label="ZIP Code">
                <TextInput name="zip" required placeholder="94103" />
              </FormField>
            </div>
          </StepSection>

          <StepSection step={2} title="Payment Method">
            <div className="grid gap-3 sm:grid-cols-2">
              <PaymentOption
                label="Cash on Delivery"
                selected={paymentMethod === "cod"}
                onSelect={() => setPaymentMethod("cod")}
              />
              <PaymentOption
                label="Payment by Card"
                selected={paymentMethod === "card"}
                onSelect={() => setPaymentMethod("card")}
              />
            </div>
            <p className="mt-4 text-sm text-slate-500">
              {paymentMethod === "cod"
                ? "Pay in cash when your order is delivered."
                : "You will be redirected to Stripe’s secure checkout page to pay by card."}
            </p>
          </StepSection>
        </div>

        <div className="lg:col-span-1">
          <CheckoutOrderSummary
            items={cart}
            subtotal={subtotal}
            taxes={taxes}
            total={total}
            submitting={loading}
            submitLabel={
              paymentMethod === "card" ? "Pay with Card" : "Place Order"
            }
            loadingLabel={
              paymentMethod === "card"
                ? "Redirecting to Stripe..."
                : "Placing order..."
            }
          />
        </div>
      </form>

      <OrderPlacedModal open={successOpen} orderId={placedOrderId} />
    </div>
  );
}
