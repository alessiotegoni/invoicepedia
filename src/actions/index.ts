"use server";

import { AVAIABLE_STATUSES } from "@/app/invoices/[id]/page";
import { db } from "@/db";
import { customers, invoices, InvoiceStatus } from "@/db/schema";
import InvoiceCreatedEmail from "@/emails/invoice-created";
import { resend, stripe } from "@/lib/config";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { CreateEmailOptions, CreateEmailRequestOptions } from "resend";

export const sendEmail = async (
  payload: CreateEmailOptions,
  options?: CreateEmailRequestOptions
) => await resend.emails.send(payload, options);

export async function createNewInvoice(formData: FormData) {
  const { userId, orgId } = await auth();

  if (!userId) return;

  const value = Math.floor(parseFloat(String(formData.get("value"))) * 100);
  const description = formData.get("description") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  const [customer] = await db
    .select({ customerId: customers.id })
    .from(customers)
    .where(and(eq(customers.email, email), eq(customers.userId, userId)));

  let customerId = customer?.customerId;

  if (!customer) {
    const [{ id }] = await db
      .insert(customers)
      .values({ userId, organizationId: orgId || null, name, email })
      .returning({ id: customers.id });

    customerId = id;
  }

  const [{ id: invoiceId }] = await db
    .insert(invoices)
    .values({
      userId,
      customerId,
      organizationId: orgId || null,
      value,
      description,
      status: "open",
    })
    .returning({ id: invoices.id });

  after(async () => {
    const { error } = await sendEmail({
      from: "Invoicepedia <info@tega.wuaze.com>",
      to: [email],
      subject: "You have a new invoice",
      react: InvoiceCreatedEmail({ invoiceId }),
    });
    console.error(error);
  });

  redirect(`/invoices/${invoiceId}`);
}

export const updateInvoiceStatus = async (formData: FormData) => {
  const { userId, orgId } = await auth();

  if (!userId) return;

  const id = parseInt(String(formData.get("id")));
  const status = formData.get("status") as InvoiceStatus;

  if (!AVAIABLE_STATUSES.includes(status)) return;

  await db
    .update(invoices)
    .set({ status })
    .where(
      and(
        eq(invoices.id, id),
        orgId ? eq(invoices.organizationId, orgId) : eq(invoices.userId, userId)
      )
    );

  revalidatePath(`/invoices/${id}`, "page");
};

export const deleteInvoice = async (formData: FormData) => {
  const { userId, orgId } = await auth();

  if (!userId) return;

  const invoiceId = parseInt(formData.get("id") as string);

  if (isNaN(invoiceId)) return;

  await db
    .delete(invoices)
    .where(
      and(
        eq(invoices.id, invoiceId),
        orgId ? eq(invoices.organizationId, orgId) : eq(invoices.userId, userId)
      )
    );

  redirect("/dashboard");
};

export async function createPayment(formData: FormData) {
  const headersList = await headers();
  const origin = headersList.get("origin");

  const id = parseInt(formData.get("id") as string);
  if (!id || isNaN(id)) throw new Error("Invaid id");

  const [invoice] = await db
    .select({ status: invoices.status, value: invoices.value })
    .from(invoices)
    .where(eq(invoices.id, id));

  if (invoice.status === "paid") return;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "eur",
          product: "prod_RWfZkdwZ4lLbAB",
          unit_amount: invoice.value,
        },
        quantity: 1,
      },
    ],
    metadata: { invoiceId: id },
    mode: "payment",
    success_url: `${origin}/invoices/${id}/payment?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/invoices/${id}/payment?status=canceled&session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session.url) throw new Error("Invalid checkout session");

  redirect(session.url);
}

export const payInvoice = async (id: number) => {
  const [{ status }] = await db
    .update(invoices)
    .set({ status: "paid" })
    .where(and(eq(invoices.id, id), eq(invoices.status, "open")))
    .returning({ status: invoices.status });

  return status;
};
