import { pgTable, text, serial, real, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { restaurantsTable } from "./restaurants";

export const menuItemsTable = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull().references(() => restaurantsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  isPopular: boolean("is_popular").default(false),
  isVegetarian: boolean("is_vegetarian").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertMenuItemSchema = createInsertSchema(menuItemsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItemsTable.$inferSelect;
