"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Job, Customer, User } from "@prisma/client";
import Link from "next/link";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { JobStatus } from "@prisma/client";

type JobWithRelations = Job & {
  customer: Customer;
  assignedTo: User | null;
};

export const columns: ColumnDef<JobWithRelations>[] = [
  {
    accessorKey: "receiptNo",
    header: "Receipt No.",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/jobs/${row.original.id}`}
        className="text-blue-500 hover:underline"
      >
        {row.getValue("receiptNo")}
      </Link>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "customer.name",
    header: "Customer",
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as JobStatus;
      const statusVariant = {
        ITEM_RECEIVED: "default",
        IN_QUEUE: "secondary",
        UNDER_REPAIR: "destructive",
        AWAITING_PARTS: "outline",
        READY_FOR_PICKUP: "default",
        PICKED_UP: "secondary",
        CANCELLED: "destructive",
      };
      return <Badge variant={statusVariant[status]}>{status.replace(/_/g, " ")}</Badge>;
    },
  },
  {
    accessorKey: "assignedTo.name",
    header: "Assigned To",
    cell: ({ row }) => {
      return row.getValue("assignedTo.name") || "Unassigned";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const job = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(job.receiptNo)}
            >
              Copy Receipt No.
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/dashboard/jobs/${job.id}`}>View Job Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/dashboard/jobs/${job.id}/edit`}>Edit Job</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
