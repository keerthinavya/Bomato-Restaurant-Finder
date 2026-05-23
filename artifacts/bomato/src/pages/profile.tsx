import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, MapPin, Receipt, Star, Heart, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const { toast } = useToast();

  const handleLogout = () => {
    toast({ title: "Logged out successfully", duration: 2000 });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 pb-32 md:pb-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">Profile</h1>
        
        <div className="bg-card border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 shadow-sm">
          <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 bg-muted border-4 border-background shadow-md">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=alexchen" alt="Alex Chen" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold">Alex Chen</h2>
            <p className="text-muted-foreground">alex.chen@email.com</p>
            <p className="text-muted-foreground">+1 555 012 3456</p>
            <div className="mt-4 inline-flex items-center text-xs font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
              Member since January 2024
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card border rounded-2xl p-4 text-center shadow-sm">
            <Receipt className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-extrabold">24</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Orders</div>
          </div>
          <div className="bg-card border rounded-2xl p-4 text-center shadow-sm">
            <Heart className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-extrabold">7</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Favorites</div>
          </div>
          <div className="bg-card border rounded-2xl p-4 text-center shadow-sm">
            <Star className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-extrabold">12</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Reviews</div>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              Saved Addresses
            </h3>
            <div className="space-y-3">
              <div className="bg-card border rounded-xl p-4 shadow-sm">
                <div className="font-semibold mb-1">Home</div>
                <div className="text-muted-foreground text-sm">42 Oak Street, SF, CA</div>
              </div>
              <div className="bg-card border rounded-xl p-4 shadow-sm">
                <div className="font-semibold mb-1">Work</div>
                <div className="text-muted-foreground text-sm">101 Mission St, SF, CA</div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Recent Orders
            </h3>
            <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
              <div className="divide-y">
                {[
                  { name: "Burger King", date: "Oct 24, 2023", amount: 24.50, status: "Delivered" },
                  { name: "Sushi Place", date: "Oct 18, 2023", amount: 42.00, status: "Delivered" },
                  { name: "Pizza Hut", date: "Oct 12, 2023", amount: 18.99, status: "Delivered" },
                ].map((order, i) => (
                  <div key={i} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-bold">{order.name}</div>
                      <div className="text-sm text-muted-foreground">{order.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${order.amount.toFixed(2)}</div>
                      <div className="text-xs text-green-600 font-medium">{order.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Separator />
          
          <Button variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive h-12 rounded-xl" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </div>
    </Layout>
  );
}