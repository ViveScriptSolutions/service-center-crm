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
import { columns } from "@/components/dashboard/jobs/columns";
import { DataTable } from "@/components/dashboard/jobs/data-table";

export default async function JobsPage() {
  const session = await auth(); // For role-based fetching later

  // TODO: Implement pagination, filtering, and role-based data fetching
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true, assignedTo: true }, // Include related data
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
          <DataTable columns={columns} data={jobs} />
        </CardContent>
      </Card>
    </div>
  );
}
