import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AddCustomerForm } from "./add-customer-form";

export default async function AddCustomerPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Customer</h1>
      <AddCustomerForm />
    </div>
  );
}
