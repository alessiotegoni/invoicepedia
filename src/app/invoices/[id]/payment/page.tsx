import { createPayment, payInvoice } from "@/actions";
import Container from "@/components/Container";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { getInvoice } from "@/lib/queries";
import { stripe } from "@/lib/config";
import { CreditCard, FileCheck2 } from "lucide-react";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{
    session_id?: string;
    status?: "success" | "canceled";
  }>;
};

export default async function InvoicePayment({ params, searchParams }: Props) {
  const [paramsData, { status, session_id }] = await Promise.all([
    params,
    searchParams,
  ]);

  const id = parseInt(paramsData.id || "d");

  if (isNaN(id)) throw new Error("Invalid id");

  let invoice = await getInvoice(id);
  if (!invoice) notFound();

  if (status === "success" && session_id && invoice.status === "open") {
    const { payment_status } =
      await stripe.checkout.sessions.retrieve(session_id);

    if (payment_status === "paid") {
      const paymentStatus = await payInvoice(id);
      if (paymentStatus === "paid") invoice = { ...invoice, status: "paid" };
    }
  }

  return (
    <main>
      <Container>
        {(status === "canceled" || (status === "success" && !session_id)) && (
          <p
            className="bg-red-100 text-sm text-red-800 text-center p-3
              rounded-lg mb-5 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800"
          >
            Something went wrong, please try again
          </p>
        )}
        <div className="grid grid-cols-2">
          <div className="space-y-4">
            <header className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
                  Invoice #{invoice.id}
                </h1>
                <StatusBadge status={invoice.status} className="self-start" />
              </div>
            </header>

            <div className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
              ${(invoice.value / 100).toFixed(2)}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {invoice.description}
            </p>

            <section>
              <h2 className="font-bold text-2xl mb-4 text-gray-800 dark:text-gray-200">
                Billing Details
              </h2>
              <div className="max-w-md space-y-4">
                <div className="grid grid-cols-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Invoice ID
                  </span>
                  <span className="text-lg text-gray-700 dark:text-gray-300">
                    {invoice.id}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Invoice Date
                  </span>
                  <span className="text-lg text-gray-700 dark:text-gray-300">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Billing Name
                  </span>
                  <span className="text-lg text-gray-700 dark:text-gray-300">
                    {invoice.customer.name}
                  </span>
                </div>
              </div>
            </section>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Manage Invoice
            </h2>
            {invoice.status === "open" && (
              <form action={createPayment}>
                <input type="hidden" name="id" value={invoice.id} />
                <Button className="bg-blue-500 text-white dark:bg-blue-600">
                  <CreditCard className="w-5 h-auto" />
                  Pay Invoice
                </Button>
              </form>
            )}
            {invoice.status === "paid" && (
              <Button
                className="bg-green-600 text-white !opacity-80 dark:bg-green-700"
                disabled
              >
                <FileCheck2 className="size-5" />
                Invoice Paid
              </Button>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
