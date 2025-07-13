import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
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

export default async function TechniciansPage() {
  const session = await auth();

  // Role-based access control: Only ADMIN can view this page
  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/dashboard"); // Or a dedicated unauthorized page
  }

  const technicians = await prisma.user.findMany({
    where: {
      role: Role.USER,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Manage Technicians</h1>
        {/* TODO: Add New Technician functionality */}
        <Button disabled>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Technician
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Technician List</CardTitle>
          <CardDescription>Browse and manage technicians.</CardDescription>
        </CardHeader>
        <CardContent>
          {technicians.length === 0 ? (
            <p>No technicians found.</p>
          ) : (
            <ul className="divide-y">
              {technicians.map((tech) => (
                <li key={tech.id} className="py-3">
                  {/* TODO: Link to technician detail page */}
                  <span className="font-medium">{tech.name}</span>
                  <p className="text-sm text-muted-foreground">{tech.email}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
