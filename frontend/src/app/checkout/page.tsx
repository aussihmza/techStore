import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { calcCartTotals } from "@/lib/cart";
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary";
import {
  FormField,
  PaymentOption,
  SelectInput,
  StepSection,
  TextInput,
} from "@/components/checkout/CheckoutForms";

type PaymentMethod = "card" | "paypal" | "apple";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, placeOrder } = useStore();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { subtotal, taxes, total } = useMemo(() => {
    const sub = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    return calcCartTotals(sub);
  }, [cart]);

  if (cart.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setLoading(true);
    setError("");

    const result = await placeOrder({
      firstName: String(data.get("firstName") ?? ""),
      lastName: String(data.get("lastName") ?? ""),
      email: String(data.get("email") ?? ""),
      address: String(data.get("address") ?? ""),
      city: String(data.get("city") ?? ""),
      state: String(data.get("state") ?? ""),
      zip: String(data.get("zip") ?? ""),
    });

    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate("/order-success");
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
                </SelectInput>
              </FormField>
              <FormField label="ZIP Code">
                <TextInput name="zip" required placeholder="94103" />
              </FormField>
            </div>
          </StepSection>

          <StepSection step={2} title="Payment Method">
            <div className="grid grid-cols-3 gap-3">
              <PaymentOption
                label="Credit Card"
                selected={paymentMethod === "card"}
                onSelect={() => setPaymentMethod("card")}
              />
              <PaymentOption
                label="PayPal"
                selected={paymentMethod === "paypal"}
                onSelect={() => setPaymentMethod("paypal")}
              />
              <PaymentOption
                label="Apple Pay"
                selected={paymentMethod === "apple"}
                onSelect={() => setPaymentMethod("apple")}
              />
            </div>

            {paymentMethod === "card" && (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <FormField label="Cardholder Name" className="sm:col-span-2">
                  <TextInput required placeholder="John Doe" />
                </FormField>
                <FormField label="Card Number" className="sm:col-span-2">
                  <TextInput required placeholder="1234 5678 9012 3456" />
                </FormField>
                <FormField label="Expiration Date">
                  <TextInput required placeholder="MM/YY" />
                </FormField>
                <FormField label="CVV">
                  <TextInput required placeholder="123" />
                </FormField>
              </div>
            )}

            {paymentMethod === "paypal" && (
              <p className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                You will be redirected to PayPal to complete your purchase securely.
              </p>
            )}

            {paymentMethod === "apple" && (
              <p className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                Confirm payment with Apple Pay on your device.
              </p>
            )}
          </StepSection>
        </div>

        <div className="space-y-4 lg:col-span-1">
          {error && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </p>
          )}
          <CheckoutOrderSummary
            items={cart}
            subtotal={subtotal}
            taxes={taxes}
            total={total}
            submitting={loading}
          />
        </div>
      </form>
    </div>
  );
}
