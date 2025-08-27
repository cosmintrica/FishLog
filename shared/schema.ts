import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  decimal,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * USERS
 */
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * FISHING RECORDS
 */
export const fishingRecords = pgTable("fishing_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  species: text("species").notNull(),
  // decimal -> TypeScript: string (ok pentru UI aflat deja pe string)
  weight: decimal("weight", { precision: 5, scale: 2 }).notNull(),
  length: integer("length"),
  location: text("location").notNull(),
  // folosim coduri județ: "B", "IF", etc. (varchar(2) e ok)
  county: varchar("county", { length: 2 }).notNull(),
  waterType: text("water_type").notNull(), // river, lake, pond, private_pond, coastal
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  dateCaught: timestamp("date_caught").notNull(),
  photos: text("photos").array(),
  description: text("description"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * FISHING LOCATIONS
 */
export const fishingLocations = pgTable("fishing_locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  type: text("type").notNull(), // river | lake | pond | private_pond | coastal
  county: varchar("county", { length: 2 }).notNull(),
  fishSpecies: text("fish_species").array(),
  description: text("description"),
});

/**
 * Zod Insert Schemas (pentru validare input)
 */
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertFishingRecordSchema = createInsertSchema(
  fishingRecords
).omit({
  id: true,
  createdAt: true,
  verified: true,
});

export const insertFishingLocationSchema = createInsertSchema(
  fishingLocations
).omit({
  id: true,
});

/**
 * Tipuri TS derivate
 */
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFishingRecord = z.infer<typeof insertFishingRecordSchema>;
export type FishingRecord = typeof fishingRecords.$inferSelect;

export type InsertFishingLocation = z.infer<typeof insertFishingLocationSchema>;
export type FishingLocation = typeof fishingLocations.$inferSelect;
