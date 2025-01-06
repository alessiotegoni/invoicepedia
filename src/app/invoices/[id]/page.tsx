import Container from "@/components/Container";
import { getInvoice } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Invoice from "./Invoice";
import { InvoiceStatus } from "@/db/schema";

type Props = {
  params: Promise<{ id?: string }>;
};

export const AVAIABLE_STATUSES: InvoiceStatus[] = [
  "open",
  "paid",
  "void",
  "uncollectible",
];

export default async function InvoicePage({ params }: Props) {
  const id = parseInt((await params).id!);

  if (isNaN(id)) throw new Error("Invalid id");

  const { userId, orgId } = await auth();

  if (!userId) return;

  const invoice = await getInvoice(id, userId, orgId);

  if (!invoice) notFound();

  return (
    <main>
      <Container>
        <Invoice invoice={invoice} />
      </Container>
    </main>
  );
}
