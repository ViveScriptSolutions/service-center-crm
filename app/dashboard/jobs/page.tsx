import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export default async function JobsPage() {
  const session = await auth(); // For role-based fetching later

  // TODO: Implement pagination, filtering, and role-based data fetching
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true, assignedTo: true }, // Include related data
    take: 20, // Limit for now
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Manage Jobs</h1>
        <Button asChild>
          <Link href="/dashboard/jobs/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Job
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Repair Orders</CardTitle>
          <CardDescription>List of all repair jobs.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO: Replace with ShadCN DataTable component */}
          {jobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            <ul>
              {jobs.map((job) => (
                <li key={job.id} className="py-2 border-b">
                  <Link
                    href={`/dashboard/jobs/${job.id}`}
                    className="hover:underline"
                  >
                    {job.receiptNo} - {job.title} (Customer: {job.customer.name}
                    )
                    {job.assignedTo && ` - Assigned to: ${job.assignedTo.name}`}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
