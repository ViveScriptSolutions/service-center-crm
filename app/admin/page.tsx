import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

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
          <p className="text-gray-700">
            This is the protected admin area. Only users with the ADMIN role can
            see this.
          </p>
          {/* Add admin-specific content here */}
        </div>
      </div>
    </div>
  );
}
