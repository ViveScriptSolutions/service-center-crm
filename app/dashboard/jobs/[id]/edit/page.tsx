import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { JobForm } from "@/components/dashboard/jobs/JobForm";
import { Role } from "@prisma/client";

export default async function EditJobPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const jobId = parseInt(params.id, 10);
  if (isNaN(jobId)) {
    notFound();
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    notFound();
  }

  // Fetch customers and technicians (same as NewJobPage)
  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
  });

  const technicians = await prisma.user.findMany({
    where: {
      role: Role.USER, // Assuming 'USER' role can be technicians, adjust if you have a 'TECHNICIAN' role
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Edit Job - {job.receiptNo}</h1>
        {/* Add a back button or breadcrumbs if desired */}
      </div>
      <JobForm job={job} customers={customers} technicians={technicians} />
    </div>
  );
}
