import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
  "open",
  "paid",
  "void",
  "uncollectible",
]);

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  organizationId: text("organizationId"),
  customerId: integer("customerId")
    .notNull()
    .references(() => customers.id),
  value: integer("value").notNull(),
  description: text("description").notNull(),
  status: statusEnum("status").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
export type selectInvoiceType = typeof invoices.$inferSelect;
export type InvoiceStatus = selectInvoiceType["status"];

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  organizationId: text("organizationId"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
export type selectCustomerType = typeof customers.$inferSelect;
