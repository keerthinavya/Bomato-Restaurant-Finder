import { createContext, useContext, useState, useCallback } from "react";
import type { MenuItem } from "@workspace/api-client-react/src/generated/api.schemas";

interface OrderItem {
  item: MenuItem;
  quantity: number;
}

interface OrderContextValue {
  restaurantId: number | null;
  items: Record<number, OrderItem>;
  totalCount: number;
  increment: (item: MenuItem, restaurantId: number) => void;
  decrement: (itemId: number) => void;
  getCount: (itemId: number) => number;
  clear: () => void;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [items, setItems] = useState<Record<number, OrderItem>>({});

  const totalCount = Object.values(items).reduce((sum, o) => sum + o.quantity, 0);

  const increment = useCallback((item: MenuItem, rid: number) => {
    if (restaurantId !== null && restaurantId !== rid) {
      setItems({ [item.id]: { item, quantity: 1 } });
      setRestaurantId(rid);
      return;
    }
    setRestaurantId(rid);
    setItems((prev) => {
      const existing = prev[item.id];
      return {
        ...prev,
        [item.id]: { item, quantity: (existing?.quantity ?? 0) + 1 },
      };
    });
  }, [restaurantId]);

  const decrement = useCallback((itemId: number) => {
    setItems((prev) => {
      const existing = prev[itemId];
      if (!existing) return prev;
      const next = existing.quantity - 1;
      if (next <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: { ...existing, quantity: next } };
    });
  }, []);

  const getCount = useCallback((itemId: number) => items[itemId]?.quantity ?? 0, [items]);

  const clear = useCallback(() => {
    setItems({});
    setRestaurantId(null);
  }, []);

  return (
    <OrderContext.Provider value={{ restaurantId, items, totalCount, increment, decrement, getCount, clear }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used inside OrderProvider");
  return ctx;
}
