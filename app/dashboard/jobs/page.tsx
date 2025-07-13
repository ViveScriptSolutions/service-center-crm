import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { JobList } from "@/components/dashboard/jobs/JobList"; // Import the reusable component
import { JobStatus, Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mapping URL-friendly query param values to JobStatus enum values
const statusQueryMap: Record<string, JobStatus> = {
  item_received: JobStatus.ITEM_RECEIVED,
  in_queue: JobStatus.IN_QUEUE,
  under_repair: JobStatus.UNDER_REPAIR,
  awaiting_parts: JobStatus.AWAITING_PARTS,
  ready_for_pickup: JobStatus.READY_FOR_PICKUP,
  picked_up: JobStatus.PICKED_UP,
  cancelled: JobStatus.CANCELLED,
};

// Helper function to fetch jobs
async function fetchJobsForPage(
  status?: JobStatus,
  _userId?: number, // Prefix with underscore to denote unused for now
  _userRole?: string // Prefix with underscore to denote unused for now
) {
  const whereClause: Prisma.JobWhereInput = {};

  if (status) {
    whereClause.status = status;
  }

  console.log("fetchJobsForPage - received status for query:", status);
  // console.log("fetchJobsForPage - Id", _userId); // Keep for later if needed
  // console.log("fetchJobsForPage - Role", _userRole); // Keep for later if needed

  // Placeholder for User Access Limitation
  // TODO: Implement full role-based access control
  // Example: If user is not ADMIN, only show jobs created by them or assigned to them.
  // if (userRole !== 'ADMIN' && userId) {
  //   whereClause.OR = [
  //     { createdById: userId },
  //     { assignedToId: userId },
  //   ];
  // } else if (!userId && userRole !== 'ADMIN') {
  //   // Non-admin user with no ID somehow? Should not happen if auth is working.
  //   // Or, if you want to prevent non-admins from seeing any jobs if their ID is missing.
  //   return []; // Return no jobs
  // }

  return prisma.job.findMany({
    where: whereClause,
    include: { customer: true, assignedTo: true },
    orderBy: { createdAt: "desc" },
    take: 50, // Add pagination later
  });
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  const userId = session.user.id ? parseInt(session.user.id) : undefined;
  const userRole = session.user.role;

  console.log("--- JobsPage Render ---");
  // Avoid JSON.stringify(searchParams) due to Next.js/Turbopack optimizations
  console.log("searchParams.status as received by page:", searchParams?.status);

  // Simplified access for debugging
  const currentStatusQuery =
    typeof searchParams?.status === "string" ? searchParams.status : undefined;
  console.log("currentStatusQuery (string from URL):", currentStatusQuery);

  const activeJobStatus = currentStatusQuery
    ? statusQueryMap[
        currentStatusQuery.toLowerCase() as keyof typeof statusQueryMap
      ]
    : undefined;

  // Define the status filter links
  const statusFilters = [
    { label: "All Jobs", query: "", jobStatus: undefined },
    {
      label: "New Jobs",
      query: "item_received",
      jobStatus: JobStatus.ITEM_RECEIVED,
    },
    {
      label: "In Progress",
      query: "under_repair",
      jobStatus: JobStatus.UNDER_REPAIR,
    },
    {
      label: "Waiting for Pickup",
      query: "ready_for_pickup",
      jobStatus: JobStatus.READY_FOR_PICKUP,
    },
    {
      label: "Finished",
      query: "picked_up",
      jobStatus: JobStatus.PICKED_UP,
    },
    {
      label: "Cancelled",
      query: "cancelled",
      jobStatus: JobStatus.CANCELLED,
    },
  ];

  const activeFilter = statusFilters.find(
    (f) => f.jobStatus === activeJobStatus
  );
  const title =
    activeFilter && activeJobStatus
      ? `${activeFilter.label} Repair Orders`
      : "All Repair Orders";
  const description =
    activeFilter && activeJobStatus
      ? `List of repair jobs with status: ${activeFilter.label}.`
      : "List of all repair jobs.";

  // Wrapper component for data fetching and Suspense
  async function JobsDataWrapper({
    status,
    pageTitle,
    pageDescription,
  }: {
    status?: JobStatus;
    pageTitle: string;
    pageDescription: string;
  }) {
    const jobs = await fetchJobsForPage(status, userId, userRole);
    return (
      <JobList
        initialJobs={jobs}
        title={pageTitle}
        description={pageDescription}
      />
    );
  }

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
      {/* Navigation for status filters */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {statusFilters.map((filter) => (
          <Button
            key={filter.label}
            variant={
              activeJobStatus === filter.jobStatus ? "default" : "outline"
            }
            asChild
          >
            <Link
              href={`/dashboard/jobs${
                filter.query ? `?status=${filter.query}` : ""
              }`}
            >
              {filter.label}
            </Link>
          </Button>
        ))}
      </div>
      {/* Display all jobs using the reusable component */}
      <Suspense
        fallback={
          <JobListLoadingSkeleton title={title} description={description} />
        }
      >
        <JobsDataWrapper
          status={activeJobStatus}
          pageTitle={title}
          pageDescription={description}
        />
      </Suspense>
    </div>
  );
}

function JobListLoadingSkeleton({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-4 border rounded-md shadow-sm animate-pulse"
            >
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-4 bg-muted rounded w-full"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
