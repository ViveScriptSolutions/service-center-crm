import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserCard } from "@/components/ui/user-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminStaffPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  const staff = await prisma.user.findMany({
    where: {
      role: {
        in: ["ADMIN", "USER"],
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <Link href="/admin/staff/new">
            <Button>Add Staff</Button>
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {staff.map((user) => (
            <UserCard key={user.id} user={user} session={session} />
          ))}
        </div>
      </main>
    </div>
  );
}
