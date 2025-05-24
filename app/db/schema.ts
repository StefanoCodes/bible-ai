import { index, jsonb, pgTable, smallint, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
// enums


// users
// TODO: add 
// subscription id
// status: "canceled",
// price_id: null,
// current_period_end: null,
// cancel_at_period_end: null,
export const usersTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    role: varchar({ enum: ["student", "adult", "teacher"] }),
    userId: uuid("user_id").notNull().unique(),
    tokens: smallint("tokens").default(15).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

}, (table) => [
    index("user_id_idx").on(table.id),
    index("user_name_idx").on(table.name),
]);

// tools
export const toolsTable = pgTable("tools", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
    systemPrompt: text().notNull(),
    intent: varchar({ length: 255 }).notNull(),
    cost: smallint("cost").default(1).notNull(),
}, (table) => [
    index("tools_id_idx").on(table.id),
    index("tools_name_idx").on(table.name),
])

// generations
export const generationsTable = pgTable("generations", {
    id: uuid("id").primaryKey().defaultRandom(),
    data: jsonb("data").notNull(),
    userId: uuid("user_id").references(() => usersTable.userId),
    toolId: uuid("tool_id").references(() => toolsTable.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
    index("id_idx").on(table.id),
    index("generations_user_id_idx").on(table.userId),
    index("generations_tool_id_idx").on(table.toolId),
])

// waitlist
export const waitlistTable = pgTable("waitlist", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar({ length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// types
export type User = typeof usersTable.$inferSelect;
export type Tool = typeof toolsTable.$inferSelect;
export type Generation = typeof generationsTable.$inferSelect
