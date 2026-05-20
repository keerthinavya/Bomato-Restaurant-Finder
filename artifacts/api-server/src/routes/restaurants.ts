import { Router, type IRouter } from "express";
import { ilike, or, eq, desc } from "drizzle-orm";
import { db, restaurantsTable } from "@workspace/db";
import {
  ListRestaurantsQueryParams,
  GetRestaurantParams,
  ListRestaurantsResponse,
  GetRestaurantResponse,
  GetFeaturedRestaurantsResponse,
  ListCuisinesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/restaurants/featured", async (req, res): Promise<void> => {
  const featured = await db
    .select()
    .from(restaurantsTable)
    .where(eq(restaurantsTable.isFeatured, true))
    .orderBy(desc(restaurantsTable.rating))
    .limit(6);
  res.json(GetFeaturedRestaurantsResponse.parse(featured));
});

router.get("/restaurants/cuisines", async (_req, res): Promise<void> => {
  const rows = await db.select({ cuisines: restaurantsTable.cuisines }).from(restaurantsTable);
  const all = rows.flatMap((r) => r.cuisines);
  const unique = [...new Set(all)].sort();
  res.json(ListCuisinesResponse.parse(unique));
});

router.get("/restaurants", async (req, res): Promise<void> => {
  const parsed = ListRestaurantsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { search, priceLevel } = parsed.data;
  const cuisine = req.query.cuisine as string | undefined;

  let query = db.select().from(restaurantsTable).$dynamic();

  if (search) {
    query = query.where(
      or(
        ilike(restaurantsTable.name, `%${search}%`),
      )
    );
  }

  if (priceLevel !== undefined) {
    query = query.where(eq(restaurantsTable.priceLevel, priceLevel));
  }

  const restaurants = await query.orderBy(desc(restaurantsTable.rating));

  let result = restaurants;
  if (cuisine) {
    result = restaurants.filter((r) =>
      r.cuisines.some((c) => c.toLowerCase() === cuisine.toLowerCase())
    );
  }

  res.json(ListRestaurantsResponse.parse(result));
});

router.get("/restaurants/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetRestaurantParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [restaurant] = await db
    .select()
    .from(restaurantsTable)
    .where(eq(restaurantsTable.id, params.data.id));

  if (!restaurant) {
    res.status(404).json({ error: "Restaurant not found" });
    return;
  }

  res.json(GetRestaurantResponse.parse(restaurant));
});

export default router;
