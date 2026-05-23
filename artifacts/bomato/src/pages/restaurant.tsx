import { useParams, Link, useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetRestaurant,
  getGetRestaurantQueryKey,
  useListMenuItems,
  getListMenuItemsQueryKey,
} from "@workspace/api-client-react";
import type { MenuItem } from "@workspace/api-client-react/src/generated/api.schemas";
import { useOrder } from "@/contexts/order-context";
import { Star, Clock, MapPin, ArrowLeft, Minus, Plus, Leaf, Flame, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RestaurantDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const [, setLocation] = useLocation();
  const { increment, decrement, getCount, totalCount } = useOrder();
  const { toast } = useToast();

  const handleIncrement = (item: MenuItem, rid: number) => {
    increment(item, rid);
    toast({ title: "Added to cart", duration: 1500 });
  };

  const { data: restaurant, isLoading, isError } = useGetRestaurant(id, {
    query: { enabled: !!id, queryKey: getGetRestaurantQueryKey(id) },
  });

  const { data: menuItems, isLoading: isLoadingMenu } = useListMenuItems(id, {
    query: { enabled: !!id, queryKey: getListMenuItemsQueryKey(id) },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="w-full h-[45vh] bg-muted animate-pulse" />
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <div className="flex gap-3">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !restaurant) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Restaurant not found</h1>
          <Button asChild variant="outline" className="rounded-full mt-4">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to listings
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const priceString = "$".repeat(restaurant.priceLevel);

  const groupedMenu = menuItems?.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {}) ?? {};

  const categories = Object.keys(groupedMenu).sort();

  return (
    <Layout>
      {/* Banner */}
      <div className="relative w-full h-[42vh] min-h-[280px] bg-black overflow-hidden">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-60"
          data-testid="img-restaurant-banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute top-5 left-5 z-10">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full bg-white/15 hover:bg-white/30 text-white border border-white/20 backdrop-blur-sm"
          >
            <Link href="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge
                className={
                  restaurant.isOpen
                    ? "bg-green-500 hover:bg-green-500 text-white border-0"
                    : "bg-white/20 text-white border-white/30"
                }
              >
                {restaurant.isOpen ? "Open Now" : "Closed"}
              </Badge>
              {restaurant.isFeatured && (
                <Badge className="bg-primary text-primary-foreground border-0">Featured</Badge>
              )}
            </div>
            <h1
              className="text-4xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-md"
              data-testid="text-restaurant-name"
            >
              {restaurant.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Info bar */}
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-6 py-5 flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-bold text-base">{restaurant.rating}</span>
            <span className="text-muted-foreground">({restaurant.reviewCount} reviews)</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{restaurant.address}</span>
          </div>
          {restaurant.deliveryTime && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{restaurant.deliveryTime} min delivery</span>
            </div>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <span className="font-bold text-base text-foreground" data-testid="text-price-level">
              {priceString}
            </span>
            <span className="text-muted-foreground text-sm">·</span>
            <div className="flex flex-wrap gap-1.5">
              {restaurant.cuisines.map((c) => (
                <Badge key={c} variant="secondary" className="rounded-full text-xs">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Menu section */}
      <div className="max-w-4xl mx-auto px-4 py-10 pb-32">
        <h2 className="text-2xl font-extrabold mb-8" data-testid="text-menu-heading">
          Menu
        </h2>

        {isLoadingMenu ? (
          <div className="space-y-10">
            {[1, 2].map((s) => (
              <div key={s} className="space-y-4">
                <Skeleton className="h-6 w-32 mb-2" />
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-28 w-full rounded-2xl" />
                ))}
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-muted-foreground text-center py-16">No menu items available.</p>
        ) : (
          <div className="space-y-10">
            {categories.map((category) => (
              <section key={category} data-testid={`section-category-${category}`}>
                <h3 className="text-lg font-bold mb-4 pb-2 border-b">{category}</h3>
                <div className="space-y-3">
                  {groupedMenu[category].map((item) => (
                    <MenuItemRow
                      key={item.id}
                      item={item}
                      count={getCount(item.id)}
                      onIncrement={() => handleIncrement(item, id)}
                      onDecrement={() => decrement(item.id)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* Sticky "View Order" button */}
      {totalCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-3 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
          <div className="max-w-4xl mx-auto pointer-events-auto">
            <Button
              size="lg"
              className="w-full h-14 text-base font-bold rounded-2xl shadow-xl flex items-center justify-between px-6"
              onClick={() => setLocation("/order-summary")}
              data-testid="button-view-order"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                View Order
              </span>
              <span className="bg-primary-foreground/20 text-primary-foreground rounded-full px-3 py-0.5 text-sm font-bold">
                {totalCount} {totalCount === 1 ? "item" : "items"}
              </span>
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
}

interface MenuItemRowProps {
  item: MenuItem;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

function MenuItemRow({ item, count, onIncrement, onDecrement }: MenuItemRowProps) {
  return (
    <div
      className="flex gap-4 items-center bg-card border rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
      data-testid={`card-menu-item-${item.id}`}
    >
      {item.imageUrl && (
        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-muted">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            data-testid={`img-menu-item-${item.id}`}
          />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <span className="font-semibold text-base leading-snug" data-testid={`text-menu-item-name-${item.id}`}>
            {item.name}
          </span>
          {item.isPopular && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wide bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              <Flame className="w-2.5 h-2.5" /> Popular
            </span>
          )}
          {item.isVegetarian && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded-full">
              <Leaf className="w-2.5 h-2.5" /> Veg
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-snug" data-testid={`text-menu-item-desc-${item.id}`}>
          {item.description}
        </p>
        <p className="mt-1.5 font-bold text-base" data-testid={`text-menu-item-price-${item.id}`}>
          ${item.price.toFixed(2)}
        </p>
      </div>

      <div className="shrink-0 flex items-center">
        {count === 0 ? (
          <Button
            size="sm"
            variant="outline"
            className="rounded-full h-9 px-5 font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={onIncrement}
            data-testid={`button-add-item-${item.id}`}
          >
            Add
          </Button>
        ) : (
          <div
            className="flex items-center gap-2 bg-primary rounded-full px-2 py-1"
            data-testid={`counter-item-${item.id}`}
          >
            <button
              onClick={onDecrement}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-primary-foreground transition-colors"
              data-testid={`button-decrement-item-${item.id}`}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span
              className="text-primary-foreground font-bold text-sm w-5 text-center"
              data-testid={`text-count-item-${item.id}`}
            >
              {count}
            </span>
            <button
              onClick={onIncrement}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-primary-foreground transition-colors"
              data-testid={`button-increment-item-${item.id}`}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
