"use server";

import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: number, role: Role) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    revalidatePath("/admin/users");
  } catch (error) {
    console.error("Failed to update user role:", error);
    throw new Error("Failed to update user role.");
  }
}
