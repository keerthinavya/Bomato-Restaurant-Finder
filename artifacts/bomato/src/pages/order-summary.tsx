import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useOrder } from "@/contexts/order-context";
import { ArrowLeft, ShoppingBag, Receipt, Ticket, CheckCircle2 } from "lucide-react";

export default function OrderSummary() {
  const [, setLocation] = useLocation();
  const { items, clear } = useOrder();
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);
  const [couponError, setCouponError] = useState("");
  const [instructions, setInstructions] = useState("");

  const orderLines = Object.values(items).filter((o) => o.quantity > 0);
  const subtotal = orderLines.reduce((sum, o) => sum + o.item.price * o.quantity, 0);

  const applyCoupon = () => {
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (code === "BOMATO20") {
      setAppliedCoupon({ code, discount: 0.20 });
    } else if (code === "FIRST50") {
      setAppliedCoupon({ code, discount: 0.50 });
    } else if (code !== "") {
      setAppliedCoupon(null);
      setCouponError("Invalid coupon code");
    }
  };

  const discountAmount = appliedCoupon ? subtotal * appliedCoupon.discount : 0;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const deliveryFee = subtotalAfterDiscount >= 15 ? 0 : 2.99;
  const platformFee = 1.99;
  const taxes = subtotalAfterDiscount * 0.08;
  const grandTotal = subtotalAfterDiscount + deliveryFee + platformFee + taxes;

  if (orderLines.length === 0) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-24 text-center flex flex-col items-center gap-6">
          <div className="bg-muted p-6 rounded-full">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Your order is empty</h1>
          <p className="text-muted-foreground">Head back and add some items to get started.</p>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/">Browse Restaurants</Link>
          </Button>
        </div>
      </Layout>
    );
  }

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
            <h1 className="text-2xl font-extrabold leading-tight" data-testid="text-page-title">
              Order Summary
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {orderLines.length} {orderLines.length === 1 ? "item" : "items"} selected
            </p>
          </div>
        </div>

        {/* Order card */}
        <div className="bg-card border rounded-2xl overflow-hidden shadow-sm space-y-6 pb-6">
          {/* Items */}
          <div className="divide-y">
            {orderLines.map(({ item, quantity }) => {
              const lineTotal = item.price * quantity;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-5 py-4"
                  data-testid={`row-order-item-${item.id}`}
                >
                  {item.imageUrl && (
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-muted">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-sm leading-snug line-clamp-1"
                      data-testid={`text-order-item-name-${item.id}`}
                    >
                      {item.name}
                    </p>
                    <p
                      className="text-xs text-muted-foreground mt-0.5"
                      data-testid={`text-order-item-unit-price-${item.id}`}
                    >
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span
                      className="text-sm font-semibold text-muted-foreground bg-muted rounded-full px-3 py-1"
                      data-testid={`text-order-item-qty-${item.id}`}
                    >
                      × {quantity}
                    </span>
                    <span
                      className="font-bold text-base w-16 text-right"
                      data-testid={`text-order-item-total-${item.id}`}
                    >
                      ${lineTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-5 space-y-3">
             <Label htmlFor="instructions" className="text-sm font-medium">Delivery Instructions</Label>
             <Textarea 
               id="instructions" 
               placeholder="Any special delivery instructions?" 
               className="resize-none rounded-xl"
               value={instructions}
               onChange={e => setInstructions(e.target.value)}
             />
          </div>

          <div className="px-5 space-y-3">
             <Label htmlFor="coupon" className="text-sm font-medium">Have a coupon?</Label>
             <div className="flex gap-2">
               <div className="relative flex-1">
                 <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <Input 
                   id="coupon" 
                   placeholder="Enter code (e.g. BOMATO20)" 
                   className="pl-9 rounded-xl uppercase"
                   value={couponCode}
                   onChange={e => setCouponCode(e.target.value)}
                 />
               </div>
               <Button variant="secondary" onClick={applyCoupon} className="rounded-xl font-bold">Apply</Button>
             </div>
             {couponError && <p className="text-sm text-destructive font-medium">{couponError}</p>}
             {appliedCoupon && (
               <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 border-0 flex items-center gap-1 w-fit">
                 <CheckCircle2 className="w-3.5 h-3.5" />
                 Coupon applied! {appliedCoupon.discount * 100}% off
               </Badge>
             )}
          </div>

          <Separator />

          {/* Totals */}
          <div className="px-5 space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>Discount ({appliedCoupon.code})</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Delivery fee</span>
              <span>{deliveryFee === 0 ? <span className="text-green-600 font-medium">Free</span> : `$${deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Platform fee</span>
              <span>${platformFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Taxes</span>
              <span>${taxes.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between items-center pt-1">
              <span className="font-extrabold text-lg">Grand Total</span>
              <span
                className="font-extrabold text-2xl"
                data-testid="text-grand-total"
              >
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Note */}
        <p className="text-xs text-center text-muted-foreground mt-5">
          Prices include applicable taxes. Delivery time may vary.
        </p>
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-3 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
        <div className="max-w-2xl mx-auto pointer-events-auto space-y-2">
          <Button
            size="lg"
            className="w-full h-14 text-base font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2"
            onClick={() => setLocation("/payment")}
            data-testid="button-proceed-payment"
          >
            <Receipt className="w-5 h-5" />
            Proceed to Payment
          </Button>
        </div>
      </div>
    </Layout>
  );
}
