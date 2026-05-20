import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, UtensilsCrossed } from "lucide-react";

const ORDER_NUMBER = () => `BOM-${Math.floor(100000 + Math.random() * 900000)}`;

export default function OrderConfirmation() {
  const orderNumber = ORDER_NUMBER();

  return (
    <Layout>
      <div className="max-w-lg mx-auto px-4 py-16 flex flex-col items-center text-center gap-6">

        {/* Success icon */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <span className="absolute -top-1 -right-1 text-2xl">🎉</span>
        </div>

        {/* Copy */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold" data-testid="text-confirmation-title">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Your order has been placed successfully. We're preparing your food and will deliver it as soon as possible.
          </p>
        </div>

        {/* Order number card */}
        <div className="w-full bg-card border rounded-2xl px-6 py-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground font-medium">Order Number</span>
            <span className="font-bold tracking-wide" data-testid="text-order-number">{orderNumber}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground font-medium">Estimated Delivery</span>
            <span className="font-bold">30 – 45 mins</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground font-medium">Status</span>
            <span className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse block" />
              Preparing
            </span>
          </div>
        </div>

        {/* What happens next */}
        <div className="w-full bg-muted/50 rounded-2xl px-6 py-5 text-left space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">What happens next</p>
          <ul className="space-y-2.5">
            {[
              "The restaurant is preparing your order",
              "A delivery partner will be assigned",
              "You'll receive updates on your delivery",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="w-full flex flex-col gap-3 pt-2">
          <Button asChild size="lg" className="h-13 rounded-2xl font-bold text-base" data-testid="button-back-home">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-13 rounded-2xl font-semibold" data-testid="button-browse-more">
            <Link href="/">
              <UtensilsCrossed className="w-4 h-4 mr-2" />
              Order from Another Restaurant
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
