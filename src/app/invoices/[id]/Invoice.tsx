"use client";

import StatusBadge from "@/components/StatusBadge";
import { deleteInvoice, updateInvoiceStatus } from "@/actions";
import { Button } from "@/components/ui/button";
import {
  InvoiceStatus,
  selectCustomerType,
  selectInvoiceType,
} from "@/db/schema";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronDown,
  CreditCard,
  EllipsisVertical,
  Trash2,
} from "lucide-react";
import { useOptimistic } from "react";
import DeleteButton from "@/components/DeleteButton";
import Link from "next/link";

type Props = {
  invoice: selectInvoiceType & { customer: selectCustomerType };
};

export const AVAIABLE_STATUSES: InvoiceStatus[] = [
  "open",
  "paid",
  "void",
  "uncollectible",
];

export default function Invoice({ invoice }: Props) {
  const [currentStatus, setCurrentStatus] = useOptimistic(
    invoice.status,
    (status, newStatus) => newStatus as InvoiceStatus
  );

  function handleUpdateStatus(formData: FormData) {
    setCurrentStatus(formData.get("status"));
    try {
      updateInvoiceStatus(formData);
    } catch (err) {
      setCurrentStatus(invoice.status);
      console.error(err);
    }
  }

  return (
    <>
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
            Invoice #{invoice.id}
          </h1>
          <StatusBadge status={currentStatus} className="self-start" />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 dark:text-gray-300"
              >
                Change Status
                <ChevronDown className="transition-transform group-aria-expanded:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 dark:bg-gray-800 dark:text-gray-200">
              {AVAIABLE_STATUSES.map((status) => (
                <DropdownMenuItem
                  key={status}
                  disabled={invoice.status === status}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <form action={handleUpdateStatus} className="w-full">
                    <input type="hidden" name="id" value={invoice.id} />
                    <input type="hidden" name="status" value={status} />
                    <button
                      type="submit"
                      className="w-full text-left dark:text-gray-300"
                    >
                      {status[0].toUpperCase() + status.slice(1)}
                    </button>
                  </form>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center dark:text-gray-300"
              >
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 dark:bg-gray-800 dark:text-gray-200">
              <DropdownMenuItem asChild disabled={currentStatus === "paid"}>
                <Link href={`/invoices/${invoice.id}/payment`}>
                  <CreditCard />
                  Payment
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full text-left mt-1 dark:text-gray-300"
                    >
                      <Trash2 />
                      Delete Invoice
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:text-gray-200">
                    <DialogHeader>
                      <DialogTitle>Delete Invoice</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this invoice? This
                        action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          className="dark:text-gray-300"
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <form action={deleteInvoice}>
                        <input type="hidden" name="id" value={invoice.id} />
                        <DeleteButton />
                      </form>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="grid gap-6">
        <div className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
          ${(invoice.value / 100).toFixed(2)}
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {invoice.description}
        </p>

        <section>
          <h2 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-200">
            Billing Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Invoice ID
              </span>
              <span className="text-lg text-gray-700 dark:text-gray-300">
                {invoice.id}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Invoice Date
              </span>
              <span className="text-lg text-gray-700 dark:text-gray-300">
                {new Date(invoice.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Billing Name
              </span>
              <span className="text-lg text-gray-700 dark:text-gray-300">
                {invoice.customer.name}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Billing Email
              </span>
              <span className="text-lg text-gray-700 dark:text-gray-300">
                {invoice.customer.email}
              </span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
