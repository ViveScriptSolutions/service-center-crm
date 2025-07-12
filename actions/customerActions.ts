"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const addCustomerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export async function addCustomer(values: z.infer<typeof addCustomerSchema>) {
  const validatedFields = addCustomerSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }

  const { name, email, phone, address } = validatedFields.data;

  try {
    await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
      },
    });
    revalidatePath("/dashboard/customers");
  } catch (error) {
    console.error("Failed to add customer:", error);
    throw new Error("Failed to add customer.");
  }
}
