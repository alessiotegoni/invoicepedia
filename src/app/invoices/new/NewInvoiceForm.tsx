"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createNewInvoice } from "@/actions";
import SubmitButton from "@/components/SubmitButton";
import { useEffect, useRef, useState } from "react";
import { getCustomers } from "@/lib/queries";

type Customer = Awaited<ReturnType<typeof getCustomers>>[0];

type Props = {
  customers: Customer[];
};

export default function NewInvoiceForm({ customers }: Props) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleSelect = (customer: Customer) => {
    setCustomer(customer);
    setEmail(customer.email);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredCustomers = customers.filter((c) =>
    c.email.toLowerCase().includes(email.toLowerCase())
  );

  useEffect(() => {
    if (email)
      setIsOpen(email !== customer?.email && !!filteredCustomers.length);
    else setIsOpen(false);
  }, [email]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form action={createNewInvoice} className="space-y-5">
      <div>
        <Label
          htmlFor="billingName"
          className="block text-sm mb-1 font-semibold"
        >
          Billing Name
        </Label>
        <Input
          type="text"
          id="billingName"
          name="name"
          value={customer?.name || ""}
          onChange={(e) =>
            setCustomer({ ...customer, name: e.target.value } as Customer)
          }
        />
      </div>
      <div>
        <div ref={containerRef} className="relative">
          <Label htmlFor="email" className="block text-sm mb-1 font-semibold">
            Billing Email
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => !!filteredCustomers.length && setIsOpen(true)}
          />
          {isOpen && (
            <div
              className="absolute top-full left-0 w-full mt-2 bg-accent border border-slate-300
        rounded-lg shadow-lg max-h-40 overflow-y-auto z-10 min-h-20 dark:border-slate-600"
            >
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.email}
                  className="cursor-pointer px-3 p-2 hover:underline"
                  onClick={() => handleSelect(customer)}
                >
                  {customer.email}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="value" className="block text-sm mb-1 font-semibold">
          Value
        </Label>
        <Input type="text" id="value" name="value" />
      </div>
      <div>
        <Label
          htmlFor="description"
          className="block text-sm mb-1 font-semibold"
        >
          Description
        </Label>
        <Textarea id="description" name="description" />
      </div>
      <SubmitButton />
    </form>
  );
}
