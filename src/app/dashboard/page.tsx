import Container from "@/components/Container";
import InvoicesTable from "@/components/InvoicesTable";
import { Button } from "@/components/ui/button";
import { getInvoices } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Dashboard"
}

export default async function InvoicesDashboard() {
  const { userId, orgId } = await auth();

  if (!userId) return;

  const invoices = await getInvoices(userId, orgId);

  return (
    <main>
      <Container>
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-3xl font-bold">Invoices</h1>
          <Button asChild variant="ghost">
            <Link href="/invoices/new">
              <CirclePlus className="size-4" />
              Create Invoice
            </Link>
          </Button>
        </div>
        <InvoicesTable data={invoices} />
      </Container>
    </main>
  );
}
