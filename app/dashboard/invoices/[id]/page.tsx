import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function InvoicePage({
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
    },
  });

  if (!job) {
    notFound();
  }

  const total =
    (job.partsCost?.toNumber() || 0) +
    (job.laborCost?.toNumber() || 0) +
    (job.otherCharges?.toNumber() || 0);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Invoice</h1>
          <p className="text-gray-500">Invoice #{job.receiptNo}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">ServicePro</p>
          <p>123 Main St, Anytown, USA</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-bold mb-2">Bill To:</h2>
          <p>{job.customer.name}</p>
          <p>{job.customer.address}</p>
          <p>{job.customer.email}</p>
          <p>{job.customer.phone}</p>
        </div>
        <div className="text-right">
          <p>
            <strong>Date:</strong> {new Date().toLocaleDateString()}
          </p>
          <p>
            <strong>Due Date:</strong>{" "}
            {new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toLocaleDateString()}
          </p>
        </div>
      </div>
      <table className="w-full mb-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">Description</th>
            <th className="text-right p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2">Parts Cost</td>
            <td className="text-right p-2">${job.partsCost?.toFixed(2)}</td>
          </tr>
          <tr>
            <td className="p-2">Labor Cost</td>
            <td className="text-right p-2">${job.laborCost?.toFixed(2)}</td>
          </tr>
          <tr>
            <td className="p-2">Other Charges</td>
            <td className="text-right p-2">${job.otherCharges?.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <div className="text-right">
        <p className="text-lg font-bold">Total: ${total.toFixed(2)}</p>
      </div>
    </div>
  );
}
