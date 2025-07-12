import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

export default async function CustomerDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const customer = await prisma.customer.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      jobs: true,
    },
  });

  if (!customer) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{customer.name}</h1>
      <div className="bg-white shadow-sm rounded-lg p-6">
        <p>
          <strong>Email:</strong> {customer.email}
        </p>
        <p>
          <strong>Phone:</strong> {customer.phone}
        </p>
        <p>
          <strong>Address:</strong> {customer.address}
        </p>
      </div>
      <h2 className="text-xl font-bold mt-8 mb-4">Jobs</h2>
      <div className="bg-white shadow-sm rounded-lg">
        {/* Jobs table will go here */}
      </div>
    </div>
  );
}
