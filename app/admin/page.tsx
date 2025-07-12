import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth();

  // This check is somewhat redundant if middleware is active,
  // but good for direct page access scenarios or as a fallback.
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.role !== Role.ADMIN) {
    // Redirect to a generic unauthorized page or home
    redirect("/unauthorized");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Welcome, {session.user.name || "Admin"}!
          </p>
        </header>
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin/users">
              <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-gray-900">Users</h2>
                <p className="text-gray-600">Manage all users</p>
              </div>
            </Link>
            <Link href="/admin/staff">
              <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-gray-900">Staff</h2>
                <p className="text-gray-600">Manage staff members</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
