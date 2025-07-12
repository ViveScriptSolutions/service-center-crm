import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { JobStatus } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { markJobAsPickedUp } from "@/actions/jobActions";
import { PickUpButton } from "./pickup-button";
import Link from "next/link";
import { QRCode } from "./qr-code";

export default async function JobDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const job = await prisma.job.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      customer: true,
      assignedTo: true,
      diagnosedBy: true,
      deliveredBy: true,
      createdBy: true,
    },
  });

  if (!job) {
    notFound();
  }

  const statusVariant = {
    ITEM_RECEIVED: "default",
    IN_QUEUE: "secondary",
    UNDER_REPAIR: "destructive",
    AWAITING_PARTS: "outline",
    READY_FOR_PICKUP: "default",
    PICKED_UP: "secondary",
    CANCELLED: "destructive",
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{job.title}</CardTitle>
            <CardDescription>
              Receipt No: {job.receiptNo}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <p>
                  <strong>Status:</strong>{" "}
                  <Badge variant={statusVariant[job.status]}>
                    {job.status.replace(/_/g, " ")}
                  </Badge>
                </p>
                <p>
                  <strong>Customer:</strong> {job.customer.name}
                </p>
                <p>
                  <strong>Assigned To:</strong>{" "}
                  {job.assignedTo?.name || "Unassigned"}
                </p>
              </div>
              <div>
                <p>
                  <strong>Created At:</strong>{" "}
                  {job.createdAt.toLocaleDateString()}
                </p>
                <p>
                  <strong>Last Updated:</strong>{" "}
                  {job.updatedAt.toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-bold">Initial Observations</h3>
              <p>{job.initialObservations}</p>
            </div>
            <div className="mt-4">
              <h3 className="font-bold">Problems Reported</h3>
              <p>{job.problemsReported}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <PickUpButton jobId={job.id} />
            <Link href={`/dashboard/invoices/${job.id}`}>
              <Button variant="outline">View Invoice</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Job QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            <QRCode value={job.id.toString()} />
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Name:</strong> {job.customer.name}
            </p>
            <p>
              <strong>Email:</strong> {job.customer.email}
            </p>
            <p>
              <strong>Phone:</strong> {job.customer.phone}
            </p>
            <p>
              <strong>Address:</strong> {job.customer.address}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
