import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";
import { format } from "date-fns";

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null | Date;
}) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="grid grid-cols-3 gap-2 py-2 border-b border-dashed">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm col-span-2">
        {value instanceof Date ? format(value, "PPP p") : String(value)}
      </dd>
    </div>
  );
}

export default async function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const customerId = parseInt(params.id, 10);
  if (isNaN(customerId)) {
    notFound();
  }

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      jobs: {
        orderBy: { createdAt: "desc" },
        take: 10, // Show recent jobs
      },
    },
  });

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/dashboard/customers">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers
          </Link>
        </Button>
        {/* TODO: Add Edit Customer functionality */}
        <Button disabled>
          <Edit className="mr-2 h-4 w-4" /> Edit Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{customer.name}</CardTitle>
          <CardDescription>Customer Details</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <DetailItem label="Phone" value={customer.phone} />
            <DetailItem label="Email" value={customer.email} />
            <DetailItem label="Address" value={customer.address} />
            <DetailItem label="Registered On" value={customer.createdAt} />
          </dl>

          <h4 className="text-lg font-semibold mt-6 mb-2 pt-4 border-t">
            Recent Jobs ({customer.jobs.length})
          </h4>
          {customer.jobs.length > 0 ? (
            <ul className="divide-y">
              {customer.jobs.map((job) => (
                <li key={job.id} className="py-2">
                  <Link
                    href={`/dashboard/jobs/${job.id}`}
                    className="hover:underline"
                  >
                    {job.receiptNo} - {job.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No jobs found for this customer.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
