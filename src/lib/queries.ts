import { db } from "@/db";
import { customers, invoices } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function getInvoices(userId: string, orgId?: string) {
  const results = await db
    .select({
      id: invoices.id,
      customerId: invoices.customerId,
      status: invoices.status,
      value: invoices.value,
      createdAt: invoices.createdAt,
      customerName: customers.name,
      customerEmail: customers.email,
    })
    .from(invoices)
    .where(
      orgId ? eq(invoices.organizationId, orgId) : eq(invoices.userId, userId)
    )
    .innerJoin(customers, eq(invoices.customerId, customers.id));

  return results;
}
export type DashboardInvoice = Awaited<ReturnType<typeof getInvoices>>[0];

export async function getInvoice(
  invoiceId: number,
  userId?: string,
  orgId?: string
) {
  const [result] = await db
    .select()
    .from(invoices)
    .innerJoin(customers, eq(invoices.customerId, customers.id))
    .where(
      and(
        eq(invoices.id, invoiceId),
        orgId
          ? eq(invoices.organizationId, orgId)
          : userId
          ? eq(invoices.userId, userId)
          : undefined
      )
    );

  if (!result) return undefined;

  return { ...result.invoices, customer: result.customers };
}

export async function getCustomers(userId: string, orgId?: string) {
  const results = await db
    .select({ name: customers.name, email: customers.email })
    .from(customers)
    .where(
      orgId ? eq(customers.organizationId, orgId) : eq(customers.userId, userId)
    );

  return results;
}
