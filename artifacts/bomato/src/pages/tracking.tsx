import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChefHat, Bike, MapPin, Package, Phone, Home } from "lucide-react";

const STEPS = [
  { icon: CheckCircle2, label: "Order Confirmed", desc: "We received your order" },
  { icon: ChefHat, label: "Restaurant Preparing", desc: "Your food is being prepared" },
  { icon: Package, label: "Food Picked Up", desc: "Delivery partner is at the restaurant" },
  { icon: Bike, label: "Out for Delivery", desc: "Your order is on the way" },
  { icon: MapPin, label: "Delivered", desc: "Enjoy your meal!" }
];

export default function Tracking() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= 4) return;
    
    const interval = setInterval(() => {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [currentStep]);

  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 py-12 pb-32 md:pb-12">
        <h1 className="text-2xl font-extrabold mb-8">Live Tracking</h1>
        
        <div className="bg-card border rounded-3xl p-6 mb-8 shadow-sm">
          <div className="relative">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStep;
              const isActive = index === currentStep;
              const isPending = index > currentStep;
              
              return (
                <div key={index} className="flex gap-4 relative pb-8 last:pb-0">
                  {index < STEPS.length - 1 && (
                    <div className={`absolute left-5 top-10 bottom-0 w-0.5 -ml-px ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />
                  )}
                  
                  <div className="relative z-10 shrink-0 mt-1">
                    {isActive ? (
                      <motion.div 
                        className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg"
                        animate={{ scale: [1, 1.1, 1], boxShadow: ["0px 0px 0px 0px rgba(var(--primary), 0.4)", "0px 0px 0px 8px rgba(var(--primary), 0)"] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <Icon className="w-5 h-5 text-primary-foreground" />
                      </motion.div>
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                    )}
                  </div>
                  
                  <div className={`pt-2 ${isActive ? 'text-foreground' : isPending ? 'text-muted-foreground' : 'text-foreground'}`}>
                    <h3 className={`font-bold ${isActive ? 'text-lg' : 'text-base'}`}>{step.label}</h3>
                    <p className={`text-sm ${isActive ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>{step.desc}</p>
                    {isCompleted && <p className="text-xs text-muted-foreground mt-1 font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {currentStep >= 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border rounded-3xl p-6 flex items-center gap-4 shadow-sm mb-8"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-muted">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=rahul" alt="Rahul Verma" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg">Rahul Verma</h3>
                <div className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                  <span className="flex items-center text-amber-500 font-bold">4.9 ⭐</span>
                  <span>·</span>
                  <span>Honda Activa</span>
                </div>
                <div className="text-xs text-muted-foreground bg-muted inline-block px-2 py-0.5 rounded mt-1">MH 12 AB 3456</div>
              </div>
              <Button size="icon" className="rounded-full shrink-0 w-12 h-12">
                <Phone className="w-5 h-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <Button asChild variant="outline" size="lg" className="w-full rounded-2xl h-14 font-bold text-base">
          <Link href="/">
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    </Layout>
  );
}