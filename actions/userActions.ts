"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ProfileFormState } from "@/lib/types/formStates";
import { UpdateProfileSchema } from "@/lib/schemas/userSchemas";

export async function updateProfile(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const rawData = {
    name: formData.get("name") as string,
    image: formData.get("image") as string,
  };

  const validatedFields = UpdateProfileSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: "Invalid data",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  const dataToUpdate: { name?: string; image?: string | null } = {};
  if (validatedFields.data.name) dataToUpdate.name = validatedFields.data.name;
  if (validatedFields.data.image === "") dataToUpdate.image = null;
  else if (validatedFields.data.image)
    dataToUpdate.image = validatedFields.data.image;

  if (Object.keys(dataToUpdate).length === 0) {
    return { message: "No changes to save." };
  }

  try {
    await prisma.user.update({
      where: { id: parseInt(session.user.id) },
      data: dataToUpdate,
    });
    revalidatePath("/dashboard/profile");
    return { success: "Profile updated successfully!" };
  } catch (error) {
    console.log(error);
    return { error: "Failed to update profile." };
  }
}
