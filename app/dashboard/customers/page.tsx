import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { Customer } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function CustomersPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const customers = await prisma.customer.findMany();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Link href="/dashboard/customers/new">
          <Button>Add Customer</Button>
        </Link>
      </div>
      <div className="bg-white shadow-sm rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/customers/${customer.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
