import { useState, useMemo } from "react";
import { Search, Flame, MapPin } from "lucide-react";
import { Layout } from "@/components/layout";
import { RestaurantCard, RestaurantCardSkeleton } from "@/components/restaurant-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  useListRestaurants, 
  useGetFeaturedRestaurants, 
  useListCuisines,
  getListRestaurantsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string | undefined>(undefined);

  // Debounce search
  useState(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const queryParams = useMemo(() => {
    return {
      search: debouncedSearch || undefined,
      cuisine: selectedCuisine,
    };
  }, [debouncedSearch, selectedCuisine]);

  const { data: restaurants, isLoading: isLoadingRestaurants } = useListRestaurants(queryParams, {
    query: {
      queryKey: getListRestaurantsQueryKey(queryParams)
    }
  });

  const { data: featured, isLoading: isLoadingFeatured } = useGetFeaturedRestaurants();
  const { data: cuisines, isLoading: isLoadingCuisines } = useListCuisines();

  return (
    <Layout>
      {/* Hero Search Section */}
      <section className="bg-primary/5 border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6 max-w-2xl">
            Find exactly what you're craving.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl">
            The city's best food, hand-picked for serious diners. Discover your next favorite spot.
          </p>
          
          <div className="w-full max-w-2xl relative flex items-center">
            <div className="absolute left-4 z-10 text-muted-foreground">
              <Search className="w-5 h-5" />
            </div>
            <Input 
              type="text" 
              placeholder="Search by restaurant name or cuisine..." 
              className="pl-12 pr-4 py-6 text-lg rounded-full shadow-sm bg-background border-muted hover:border-primary/50 transition-colors focus-visible:ring-primary focus-visible:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Cuisines Filter */}
      <section className="border-b bg-background sticky top-16 z-40 shadow-sm">
        <div className="container mx-auto">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-2 p-4">
              <Button
                variant={!selectedCuisine ? "default" : "secondary"}
                className={`rounded-full ${!selectedCuisine ? "shadow-md" : "bg-secondary/50 hover:bg-secondary"}`}
                onClick={() => setSelectedCuisine(undefined)}
              >
                All
              </Button>
              {isLoadingCuisines ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-10 w-24 bg-muted rounded-full animate-pulse" />
                ))
              ) : (
                cuisines?.map((cuisine) => (
                  <Button
                    key={cuisine}
                    variant={selectedCuisine === cuisine ? "default" : "secondary"}
                    className={`rounded-full ${selectedCuisine === cuisine ? "shadow-md" : "bg-secondary/50 hover:bg-secondary"}`}
                    onClick={() => setSelectedCuisine(cuisine)}
                  >
                    {cuisine}
                  </Button>
                ))
              )}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 flex flex-col gap-16">
        {/* Featured Section (Only show if no search/filter active) */}
        {!debouncedSearch && !selectedCuisine && (
          <section>
            <div className="flex items-center gap-2 mb-8">
              <Flame className="w-6 h-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold">Featured Spots</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingFeatured ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <RestaurantCardSkeleton key={i} />
                ))
              ) : (
                featured?.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))
              )}
            </div>
          </section>
        )}

        {/* All Restaurants Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              {debouncedSearch || selectedCuisine ? "Search Results" : "All Restaurants"}
            </h2>
            {restaurants && (
              <span className="text-muted-foreground font-medium bg-muted px-3 py-1 rounded-full text-sm">
                {restaurants.length} found
              </span>
            )}
          </div>

          {isLoadingRestaurants ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <RestaurantCardSkeleton key={i} />
              ))}
            </div>
          ) : restaurants?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-3xl border border-dashed">
              <div className="bg-secondary/50 p-6 rounded-full mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No restaurants found</h3>
              <p className="text-muted-foreground max-w-md">
                We couldn't find any spots matching your criteria. Try adjusting your search or filters to discover more.
              </p>
              {(debouncedSearch || selectedCuisine) && (
                <Button 
                  variant="outline" 
                  className="mt-6 rounded-full"
                  onClick={() => {
                    setSearchQuery("");
                    setDebouncedSearch("");
                    setSelectedCuisine(undefined);
                  }}
                >
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {restaurants?.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
