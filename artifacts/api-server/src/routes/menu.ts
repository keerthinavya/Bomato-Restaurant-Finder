import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, menuItemsTable, restaurantsTable } from "@workspace/db";
import { ListMenuItemsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/restaurants/:restaurantId/menu", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.restaurantId) ? req.params.restaurantId[0] : req.params.restaurantId;
  const restaurantId = parseInt(raw, 10);

  if (isNaN(restaurantId)) {
    res.status(400).json({ error: "Invalid restaurant ID" });
    return;
  }

  const [restaurant] = await db
    .select({ id: restaurantsTable.id })
    .from(restaurantsTable)
    .where(eq(restaurantsTable.id, restaurantId));

  if (!restaurant) {
    res.status(404).json({ error: "Restaurant not found" });
    return;
  }

  const items = await db
    .select()
    .from(menuItemsTable)
    .where(eq(menuItemsTable.restaurantId, restaurantId))
    .orderBy(menuItemsTable.category, menuItemsTable.name);

  res.json(ListMenuItemsResponse.parse(items));
});

export default router;
