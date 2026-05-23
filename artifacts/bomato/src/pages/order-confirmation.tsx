import { useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, Navigation } from "lucide-react";
import { useOrder } from "@/contexts/order-context";
import { motion } from "framer-motion";

export default function OrderConfirmation() {
  const [orderNumber] = useState(() => `BOM-${Math.floor(100000 + Math.random() * 900000)}`);
  const { deliveryInfo, clear } = useOrder();

  const handleBackHome = () => {
    clear();
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto px-4 py-16 flex flex-col items-center text-center gap-6 pb-32 md:pb-16">

        {/* Success icon */}
        <div className="relative">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shadow-lg"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </motion.div>
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

        {deliveryInfo && (
          <div className="w-full bg-card border rounded-2xl px-6 py-5 shadow-sm text-left space-y-3">
             <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Delivery Info</h3>
             <div>
               <div className="font-bold">{deliveryInfo.name}</div>
               <div className="text-sm text-muted-foreground">{deliveryInfo.address}</div>
             </div>
             <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm text-muted-foreground font-medium">Payment Method</span>
                <span className="font-bold text-sm uppercase tracking-wider">{deliveryInfo.paymentMethod}</span>
             </div>
          </div>
        )}

        {/* CTAs */}
        <div className="w-full flex flex-col gap-3 pt-2">
          <Button asChild size="lg" className="h-14 rounded-2xl font-bold text-base" data-testid="button-track-order">
            <Link href="/tracking">
              <Navigation className="w-5 h-5 mr-2" />
              Track Order
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-14 rounded-2xl font-semibold" data-testid="button-back-home" onClick={handleBackHome}>
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
