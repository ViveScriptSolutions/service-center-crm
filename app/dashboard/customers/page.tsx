import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

// TODO: Replace with ShadCN DataTable component

export default async function CustomersPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
    take: 50, // Add pagination later
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Manage Customers</h1>
        {/* TODO: Add New Customer functionality */}
        <Button disabled>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Customer
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>Browse and manage your customers.</CardDescription>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <p>No customers found.</p>
          ) : (
            <ul className="divide-y">
              {customers.map((customer) => (
                <li key={customer.id} className="py-3">
                  <Link
                    href={`/dashboard/customers/${customer.id}`}
                    className="hover:underline font-medium"
                  >
                    {customer.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {customer.phone} {customer.email && `- ${customer.email}`}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
