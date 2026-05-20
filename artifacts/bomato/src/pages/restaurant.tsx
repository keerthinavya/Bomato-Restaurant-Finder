import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetRestaurant, getGetRestaurantQueryKey } from "@workspace/api-client-react";
import { Star, Clock, MapPin, ArrowLeft, Info, Utensils, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function RestaurantDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const { toast } = useToast();

  const { data: restaurant, isLoading, isError } = useGetRestaurant(id, {
    query: {
      enabled: !!id,
      queryKey: getGetRestaurantQueryKey(id)
    }
  });

  const handleOrder = () => {
    toast({
      title: "Order Started",
      description: `Starting order for ${restaurant?.name}. This is a mockup.`,
      duration: 3000,
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="w-full h-[40vh] md:h-[50vh] bg-muted animate-pulse" />
        <div className="container mx-auto px-4 -mt-16 relative z-10 pb-20">
          <div className="bg-card rounded-3xl p-6 md:p-10 shadow-xl border">
            <Skeleton className="h-10 w-2/3 mb-4" />
            <Skeleton className="h-6 w-1/3 mb-8" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !restaurant) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center flex flex-col items-center">
          <div className="bg-destructive/10 p-6 rounded-full mb-6 text-destructive">
            <Info className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Restaurant Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            We couldn't find the restaurant you're looking for. It might have been removed or the URL is incorrect.
          </p>
          <Button asChild className="rounded-full">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const priceString = "$".repeat(restaurant.priceLevel);

  return (
    <Layout>
      {/* Hero Image Section */}
      <div className="relative w-full h-[40vh] md:h-[50vh] bg-black">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <div className="absolute top-6 left-6 z-20">
          <Button variant="secondary" size="icon" asChild className="rounded-full bg-white/20 hover:bg-white/40 text-white border-0 backdrop-blur-md">
            <Link href="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-20 md:-mt-32 relative z-10 pb-20">
        <div className="bg-card rounded-3xl p-6 md:p-10 shadow-2xl border flex flex-col md:flex-row gap-8 items-start justify-between">
          
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {restaurant.isOpen ? (
                <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">Open Now</Badge>
              ) : (
                <Badge variant="secondary" className="bg-muted text-muted-foreground border-0">Closed</Badge>
              )}
              {restaurant.isFeatured && (
                <Badge className="bg-accent text-accent-foreground border-0">Featured</Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              {restaurant.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-lg mb-8">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 fill-accent text-accent" />
                <span className="font-bold">{restaurant.rating}</span>
                <span className="text-muted-foreground text-base">({restaurant.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span>{restaurant.address}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-secondary/40 rounded-2xl p-4 flex flex-col gap-1">
                <span className="text-muted-foreground text-sm font-medium">Price</span>
                <span className="font-bold text-xl">{priceString}</span>
              </div>
              <div className="bg-secondary/40 rounded-2xl p-4 flex flex-col gap-1">
                <span className="text-muted-foreground text-sm font-medium">Delivery</span>
                <span className="font-bold text-xl">{restaurant.deliveryTime ? `${restaurant.deliveryTime}m` : 'N/A'}</span>
              </div>
              <div className="bg-secondary/40 rounded-2xl p-4 flex flex-col gap-1 col-span-2">
                <span className="text-muted-foreground text-sm font-medium">Cuisines</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {restaurant.cuisines.map(c => (
                    <span key={c} className="text-sm font-semibold">{c}{c !== restaurant.cuisines[restaurant.cuisines.length-1] ? ', ' : ''}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h3 className="flex items-center gap-2 font-bold text-xl mb-4">
                <Utensils className="w-5 h-5 text-primary" /> About {restaurant.name}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Experience the vibrant flavors and exceptional service at {restaurant.name}. 
                Known for its mastery of {restaurant.cuisines.join(' and ')}, this spot is a favorite 
                among locals and visitors alike. Whether you're dining in or ordering out, 
                expect a memorable culinary journey crafted with the finest ingredients.
              </p>
              
              <ul className="mt-6 space-y-2 list-none pl-0">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Top-rated by local foodies
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Fast and reliable delivery
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Premium quality ingredients
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full md:w-80 lg:w-96 flex-shrink-0 bg-muted/30 rounded-3xl p-6 border sticky top-24">
            <h3 className="font-bold text-xl mb-6">Ready to eat?</h3>
            <Button 
              size="lg" 
              className="w-full text-lg h-14 rounded-xl shadow-lg hover:shadow-xl transition-all"
              onClick={handleOrder}
              disabled={!restaurant.isOpen}
            >
              {restaurant.isOpen ? "Start Order" : "Currently Closed"}
            </Button>
            {!restaurant.isOpen && (
              <p className="text-sm text-center text-muted-foreground mt-4">
                Check back later during normal business hours.
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
