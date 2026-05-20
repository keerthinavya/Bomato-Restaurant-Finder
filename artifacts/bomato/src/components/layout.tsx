import { Link } from "wouter";
import { UtensilsCrossed } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
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
            {/* Additional header actions could go here */}
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="py-8 border-t bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground font-medium">
          &copy; {new Date().getFullYear()} Bomato. Designed for serious diners.
        </div>
      </footer>
    </div>
  );
}
