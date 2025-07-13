import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { JobStatus } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Edit, Printer } from "lucide-react";
import { format } from "date-fns";

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null | Date | React.ReactNode;
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

export default async function JobDetailPage({
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
    include: {
      customer: true,
      assignedTo: true, // Technician
      diagnosedBy: true,
      deliveredBy: true,
      createdBy: true,
    },
  });

  if (!job) {
    notFound();
  }

  // Optional: Role-based access check if needed (e.g., technician can only see assigned jobs)
  // if (session.user.role === Role.USER && job.assignedToId !== parseInt(session.user.id)) {
  //   redirect("/unauthorized");
  // }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/dashboard/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" /> Print Job Sheet
          </Button>
          <Button asChild>
            <Link href={`/dashboard/jobs/${job.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" /> Edit Job
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">
                Job: {job.receiptNo} - {job.title}
              </CardTitle>
              <CardDescription>
                Customer: {job.customer.name} ({job.customer.phone})
              </CardDescription>
            </div>
            <Badge
              variant={
                job.status === JobStatus.PICKED_UP ? "default" : "secondary"
              }
            >
              Status: {job.status.replace(/_/g, " ")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-gray-200 dark:divide-gray-700">
            <DetailItem label="Check-in Date" value={job.checkInDate} />
            <DetailItem label="Printer Brand" value={job.printerBrand} />
            <DetailItem label="Printer Model" value={job.printerModel} />
            <DetailItem label="Printer Serial" value={job.printerSerial} />
            <DetailItem
              label="Accessories Received"
              value={job.accessoriesReceived}
            />
            <DetailItem
              label="Problems Reported"
              value={job.problemsReported}
            />
            <DetailItem
              label="Initial Observations"
              value={job.initialObservations}
            />

            <h4 className="text-md font-semibold mt-4 pt-2 border-t">
              Assignment & Diagnosis
            </h4>
            <DetailItem label="Assigned To" value={job.assignedTo?.name} />
            <DetailItem label="Diagnosed By" value={job.diagnosedBy?.name} />
            <DetailItem label="Diagnosis Notes" value={job.diagnosisNotes} />
            <DetailItem
              label="Expected Delivery"
              value={job.expectedDeliveryDate}
            />

            <h4 className="text-md font-semibold mt-4 pt-2 border-t">
              Repair & Billing
            </h4>
            <DetailItem label="Repair Summary" value={job.repairSummary} />
            <DetailItem label="Work Done" value={job.workDone} />
            {/* TODO: Display partsReplaced (JSON) in a structured way */}
            <DetailItem label="Parts Cost" value={job.partsCost?.toString()} />
            <DetailItem label="Labor Cost" value={job.laborCost?.toString()} />
            <DetailItem
              label="Other Charges"
              value={job.otherCharges?.toString()}
            />
            <DetailItem
              label="Total Charge"
              value={job.totalCharge?.toString()}
            />
            <DetailItem
              label="Payment Status"
              value={job.paymentStatus?.replace(/_/g, " ")}
            />
            <DetailItem label="Payment Method" value={job.paymentMethod} />

            <h4 className="text-md font-semibold mt-4 pt-2 border-t">
              Delivery & Pickup
            </h4>
            <DetailItem
              label="Customer Notified"
              value={job.customerNotifiedDate}
            />
            <DetailItem
              label="Picked Up"
              value={job.customerPickedUp ? "Yes" : "No"}
            />
            <DetailItem label="Pickup Date" value={job.pickupDate} />
            <DetailItem label="Delivered By" value={job.deliveredBy?.name} />
            <DetailItem
              label="Delivery Timestamp"
              value={job.deliveryTimestamp}
            />

            <h4 className="text-md font-semibold mt-4 pt-2 border-t">
              System Information
            </h4>
            <DetailItem label="Created By" value={job.createdBy?.name} />
            <DetailItem label="Created At" value={job.createdAt} />
            <DetailItem label="Last Updated At" value={job.updatedAt} />
            <DetailItem label="Internal Notes" value={job.notes} />
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
