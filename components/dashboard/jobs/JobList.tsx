"use client"; // Make this a client component for interactive delete
import { Job, JobStatus, User, Customer } from "@prisma/client"; // Import Prisma types
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { deleteJobAction } from "@/actions/jobActions";
import { useState } from "react"; // Ensure this is from 'react'

interface JobListProps {
  status?: JobStatus; // Optional status filter
  title: string;
  description: string;
}

// This type should match the structure of the data fetched in JobsPage.tsx
type JobWithRelations = Job & {
  customer: Customer;
  assignedTo: User | null;
};

// The component now receives jobs as a prop
export function JobList({
  initialJobs,
  title,
  description,
}: JobListProps & { initialJobs: JobWithRelations[] }) {
  // const [isPending, startTransition] = useTransition(); // Temporarily comment out
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState(initialJobs);

  const handleDelete = (jobId: number) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      // startTransition(async () => { // Temporarily comment out
      (async () => {
        // Immediately invoke for testing
        setError(null);
        const result = await deleteJobAction(jobId);
        if (result.error) {
          setError(result.error);
        } else {
          // Optimistically update UI
          setJobs((currentJobs) =>
            currentJobs.filter((job) => job.id !== jobId)
          );
        }
      })();
      // });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <p>No jobs found with this status.</p>
        ) : (
          <div className="space-y-4">
            {error && (
              <p className="text-sm text-destructive p-2 bg-destructive/10 rounded-md">
                {error}
              </p>
            )}
            {jobs.map((job) => (
              <div key={job.id} className="p-4 border rounded-md shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      href={`/dashboard/jobs/${job.id}`}
                      className="hover:underline font-semibold text-lg text-primary"
                    >
                      {job.receiptNo} - {job.title}
                    </Link>
                    <span className="ml-2 text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                      {job.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/jobs/${job.id}/edit`}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(job.id)}
                      disabled={false /* isPending */} // Temporarily disable based on isPending
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-sm">
                  <p>
                    <span className="font-medium text-muted-foreground">
                      Customer:
                    </span>{" "}
                    {job.customer.name} ({job.customer.phone})
                  </p>
                  <p>
                    <span className="font-medium text-muted-foreground">
                      Checked In:
                    </span>{" "}
                    {format(new Date(job.checkInDate), "PP")}
                  </p>
                  <p>
                    <span className="font-medium text-muted-foreground">
                      Device:
                    </span>{" "}
                    {job.printerBrand} {job.printerModel}
                  </p>
                  <p>
                    <span className="font-medium text-muted-foreground">
                      Assigned:
                    </span>{" "}
                    {job.assignedTo ? job.assignedTo.name : "Unassigned"}
                  </p>
                  {job.expectedDeliveryDate && (
                    <p>
                      <span className="font-medium text-muted-foreground">
                        Expected By:
                      </span>{" "}
                      {format(new Date(job.expectedDeliveryDate), "PP")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
