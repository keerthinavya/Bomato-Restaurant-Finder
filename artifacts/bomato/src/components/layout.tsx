import { Link, useLocation } from "wouter";
import { UtensilsCrossed, Sun, Moon, Home, Heart, Package, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background pb-16 md:pb-0">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl group-hover:-rotate-12 transition-transform duration-300">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <span className="font-bold font-['Outfit'] text-2xl tracking-tight text-foreground">
              Bomato
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 mr-4">
              <Link href="/" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>Home</Link>
              <Link href="/favorites" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/favorites' ? 'text-primary' : 'text-muted-foreground'}`}>Favorites</Link>
              <Link href="/profile" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/profile' ? 'text-primary' : 'text-muted-foreground'}`}>Profile</Link>
            </nav>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="py-8 border-t bg-muted/30 hidden md:block">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground font-medium">
          &copy; {new Date().getFullYear()} Bomato. Designed for serious diners.
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t flex items-center justify-around h-16 pb-safe px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
        <Link href="/" className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${location === '/' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/favorites" className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${location === '/favorites' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <Heart className="w-5 h-5" />
          <span className="text-[10px] font-medium">Favorites</span>
        </Link>
        <Link href="/order-confirmation" className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${location === '/order-confirmation' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <Package className="w-5 h-5" />
          <span className="text-[10px] font-medium">Orders</span>
        </Link>
        <Link href="/profile" className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${location === '/profile' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </div>
    </div>
  );
}
