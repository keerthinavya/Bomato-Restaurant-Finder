import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useOrder } from "@/contexts/order-context";
import { ArrowLeft, CreditCard, Smartphone, Truck, Loader2, ShoppingBag } from "lucide-react";

type PaymentMethod = "upi" | "card" | "cod";

export default function Payment() {
  const [, setLocation] = useLocation();
  const { items, clear, setDeliveryInfo } = useOrder();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const orderLines = Object.values(items).filter((o) => o.quantity > 0);
  const grandTotal = orderLines.reduce((sum, o) => sum + o.item.price * o.quantity, 0);
  const totalItems = orderLines.reduce((sum, o) => sum + o.quantity, 0);

  if (orderLines.length === 0) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-24 text-center flex flex-col items-center gap-6">
          <div className="bg-muted p-6 rounded-full">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">No items to pay for</h1>
          <p className="text-muted-foreground">Add some items from a restaurant first.</p>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/">Browse Restaurants</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Full name is required";
    if (!phone.trim()) e.phone = "Phone number is required";
    else if (!/^\+?[\d\s\-]{7,15}$/.test(phone.trim())) e.phone = "Enter a valid phone number";
    if (!address.trim()) e.address = "Delivery address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    setDeliveryInfo({ name: fullName, phone, address, paymentMethod: method });
    setTimeout(() => {
      setLocation("/order-confirmation");
    }, 2000);
  };

  const buttonLabel = method === "cod" ? "Place Order" : "Pay Now";

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-10 pb-36">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => history.back()}
            className="rounded-full border"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold" data-testid="text-page-title">
              Payment Details
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {totalItems} {totalItems === 1 ? "item" : "items"} · ${grandTotal.toFixed(2)} total
            </p>
          </div>
        </div>

        <div className="space-y-5">

          {/* ── Order Summary ── */}
          <section className="bg-card border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 pt-5 pb-3">
              <h2 className="font-bold text-base mb-4">Order Summary</h2>
              <div className="space-y-3">
                {orderLines.map(({ item, quantity }) => (
                  <div key={item.id} className="flex items-center justify-between gap-4" data-testid={`row-payment-item-${item.id}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      {item.imageUrl && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-muted">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-snug line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} × {quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm shrink-0" data-testid={`text-payment-item-total-${item.id}`}>
                      ${(item.price * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
            <div className="px-5 py-4 flex justify-between items-center">
              <span className="font-extrabold text-base">Total Payable</span>
              <span className="font-extrabold text-xl" data-testid="text-total-payable">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </section>

          {/* ── Delivery Address ── */}
          <section className="bg-card border rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="font-bold text-base">Delivery Address</h2>

            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="e.g. Jane Smith"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setErrors((p) => ({ ...p, fullName: "" })); }}
                className={`rounded-xl h-11 ${errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                data-testid="input-full-name"
              />
              {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g. +1 555 000 1234"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: "" })); }}
                className={`rounded-xl h-11 ${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                data-testid="input-phone"
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-sm font-medium">
                Delivery Address
              </Label>
              <textarea
                id="address"
                rows={3}
                placeholder="Street, apartment, city, zip code…"
                value={address}
                onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: "" })); }}
                className={`w-full rounded-xl border bg-background px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none ${errors.address ? "border-destructive focus-visible:ring-destructive" : ""}`}
                data-testid="input-address"
              />
              {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
            </div>
          </section>

          {/* ── Payment Method ── */}
          <section className="bg-card border rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-base mb-4">Payment Method</h2>
            <div className="space-y-3">
              {(
                [
                  { value: "upi", label: "UPI", sub: "Pay instantly via UPI ID or QR code", icon: <Smartphone className="w-5 h-5" /> },
                  { value: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, Rupay accepted", icon: <CreditCard className="w-5 h-5" /> },
                  { value: "cod", label: "Cash on Delivery", sub: "Pay in cash when your order arrives", icon: <Truck className="w-5 h-5" /> },
                ] as { value: PaymentMethod; label: string; sub: string; icon: React.ReactNode }[]
              ).map(({ value, label, sub, icon }) => {
                const selected = method === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMethod(value)}
                    data-testid={`radio-payment-${value}`}
                    className={`w-full flex items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-all duration-150 ${
                      selected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/40 hover:bg-muted/40"
                    }`}
                  >
                    <span className={`flex-shrink-0 ${selected ? "text-primary" : "text-muted-foreground"}`}>
                      {icon}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold leading-snug">{label}</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">{sub}</span>
                    </span>
                    <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                      selected ? "border-primary" : "border-muted-foreground/40"
                    }`}>
                      {selected && <span className="w-2 h-2 rounded-full bg-primary block" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-3 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
        <div className="max-w-2xl mx-auto pointer-events-auto">
          <Button
            size="lg"
            className="w-full h-14 text-base font-bold rounded-2xl shadow-xl disabled:opacity-70"
            onClick={handleSubmit}
            disabled={loading}
            data-testid="button-make-payment"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing…
              </span>
            ) : (
              buttonLabel
            )}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
