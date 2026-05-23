import { useFavorites } from "@/contexts/favorites-context";
import { useListRestaurants, getListRestaurantsQueryKey } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { RestaurantCard, RestaurantCardSkeleton } from "@/components/restaurant-card";
import { Heart } from "lucide-react";

export default function Favorites() {
  const { favoriteIds } = useFavorites();
  const { data: restaurants, isLoading } = useListRestaurants(undefined, {
    query: { queryKey: getListRestaurantsQueryKey(undefined) }
  });

  const favoriteRestaurants = restaurants?.filter(r => favoriteIds.includes(r.id)) || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 pb-32 md:pb-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Your Favorites</h1>
          <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full">
            {favoriteRestaurants.length}
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <RestaurantCardSkeleton key={i} />
            ))}
          </div>
        ) : favoriteRestaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-3xl border border-dashed shadow-sm">
            <div className="bg-primary/10 p-6 rounded-full mb-6">
              <Heart className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground max-w-md">
              Tap the heart on any restaurant to save it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}