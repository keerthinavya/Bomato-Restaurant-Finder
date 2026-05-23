import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OrderProvider } from "@/contexts/order-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { FavoritesProvider } from "@/contexts/favorites-context";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import RestaurantDetail from "@/pages/restaurant";
import OrderSummary from "@/pages/order-summary";
import Payment from "@/pages/payment";
import OrderConfirmation from "@/pages/order-confirmation";
import Favorites from "@/pages/favorites";
import Profile from "@/pages/profile";
import Tracking from "@/pages/tracking";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/restaurants/:id" component={RestaurantDetail} />
      <Route path="/order-summary" component={OrderSummary} />
      <Route path="/payment" component={Payment} />
      <Route path="/order-confirmation" component={OrderConfirmation} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/profile" component={Profile} />
      <Route path="/tracking" component={Tracking} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <OrderProvider>
            <FavoritesProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
            </FavoritesProvider>
          </OrderProvider>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
