import { JobForm } from "@/components/dashboard/jobs/JobForm"; // We'll create this next
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";

export default async function NewJobPage() {
  // Fetch necessary data for dropdowns, e.g., customers, technicians (users)
  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
  });
  const technicians = await prisma.user.findMany({ orderBy: { name: "asc" } }); // Or filter by a 'technician' role if you add one

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Add New Job</h1>
      <Card>
        <CardHeader>
          <CardTitle>New Repair Order</CardTitle>
          <CardDescription>Enter the details for the new job.</CardDescription>
        </CardHeader>
        <CardContent>
          <JobForm customers={customers} technicians={technicians} />
        </CardContent>
      </Card>
    </div>
  );
}
