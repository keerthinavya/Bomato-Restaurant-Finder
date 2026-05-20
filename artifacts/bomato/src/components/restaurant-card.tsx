import { Link } from "wouter";
import { Star, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Restaurant } from "@workspace/api-client-react/src/generated/api.schemas";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { id, name, imageUrl, rating, reviewCount, cuisines, priceLevel, isOpen, deliveryTime } = restaurant;

  const priceString = "$".repeat(priceLevel);

  return (
    <div className="group relative flex flex-col bg-card rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link href={`/restaurants/${id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {name} details</span>
      </Link>
      
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={`Exterior of ${name}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 z-20">
          {isOpen ? (
            <Badge className="bg-white/90 text-black hover:bg-white border-0 shadow-sm backdrop-blur-sm">Open</Badge>
          ) : (
            <Badge variant="secondary" className="bg-black/80 text-white hover:bg-black/80 border-0 shadow-sm backdrop-blur-sm">Closed</Badge>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="font-bold text-xl leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1 bg-accent/10 text-accent-foreground px-2 py-1 rounded-md">
            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
            <span className="text-sm font-bold">{rating}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{priceString}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span className="flex items-center gap-1">
            {reviewCount} reviews
          </span>
          {deliveryTime && (
            <>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {deliveryTime} min
              </span>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {cuisines.slice(0, 3).map((cuisine) => (
            <Badge key={cuisine} variant="secondary" className="bg-secondary/50 hover:bg-secondary">
              {cuisine}
            </Badge>
          ))}
          {cuisines.length > 3 && (
            <Badge variant="secondary" className="bg-secondary/50">+{cuisines.length - 3}</Badge>
          )}
        </div>

        <div className="mt-auto pt-4 border-t flex justify-end">
          <Button 
            className="w-full relative z-20 hover-elevate font-semibold"
            onClick={(e) => {
              e.preventDefault();
              // Prevent link click when clicking button directly
            }}
          >
            Order Now
          </Button>
        </div>
      </div>
    </div>
  );
}

export function RestaurantCardSkeleton() {
  return (
    <div className="flex flex-col bg-card rounded-2xl border overflow-hidden shadow-sm animate-pulse">
      <div className="h-48 w-full bg-muted" />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="h-6 bg-muted rounded-md w-2/3" />
          <div className="h-6 bg-muted rounded-md w-12" />
        </div>
        <div className="flex gap-2 mb-5">
          <div className="h-4 bg-muted rounded-md w-16" />
          <div className="h-4 bg-muted rounded-md w-20" />
        </div>
        <div className="flex gap-2 mb-6">
          <div className="h-5 bg-muted rounded-full w-16" />
          <div className="h-5 bg-muted rounded-full w-20" />
        </div>
        <div className="mt-auto pt-4 border-t">
          <div className="h-10 bg-muted rounded-lg w-full" />
        </div>
      </div>
    </div>
  );
}
