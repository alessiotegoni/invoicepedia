"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { InvoiceStatus } from "@/db/schema";
import StatusBadge from "./StatusBadge";
import { DashboardInvoice } from "@/lib/queries";

type Props = {
  data: DashboardInvoice[];
};

export default function InvoicesTable({ data }: Props) {
  const router = useRouter();

  const coloumnsArr: Array<keyof DashboardInvoice> = [
    "createdAt",
    "customerName",
    "customerEmail",
    "status",
    "value",
  ];
  const columnHelper = createColumnHelper<DashboardInvoice>();
  const columns = coloumnsArr.map((colName) =>
    columnHelper.accessor(colName, {
      id: colName,
      header: colName[0].toUpperCase() + colName.slice(1),
      cell: ({ getValue }) => {
        const value = getValue();

        if (colName === "value")
          return "$" + ((value as number) / 100).toFixed(2);
        if (colName === "status")
          return <StatusBadge status={value as InvoiceStatus} />;
        if (colName === "createdAt")
          return new Date(value).toLocaleDateString();

        return value;
      },
    })
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table className="rounded-lg overflow-hidden">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className="p-4">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            onClick={() => router.push(`/invoices/${row.original.id}`)}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                className={`p-4 ${
                  cell.column.id !== "customerEmail" ? "font-semibold" : ""
                }`}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
