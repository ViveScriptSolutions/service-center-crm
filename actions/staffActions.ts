"use server";

import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";

const addStaffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.nativeEnum(Role),
});

export async function addStaff(values: z.infer<typeof addStaffSchema>) {
  const validatedFields = addStaffSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Invalid fields");
  }

  const { name, email, password, role } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
    revalidatePath("/admin/staff");
  } catch (error) {
    console.error("Failed to add staff member:", error);
    throw new Error("Failed to add staff member.");
  }
}
