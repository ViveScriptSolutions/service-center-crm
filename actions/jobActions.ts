"use server";

import * as z from "zod";
import prisma from "@/lib/prisma";
import { JobStatus, Prisma } from "@prisma/client"; // Import Prisma namespace
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import {
  JobFormValidationSchema,
  CreateJobInternalSchema,
  type CreateJobInput,
} from "@/lib/schemas/jobSchemas";

// The action now takes the raw form values (IDs as strings)
export async function createJobAction(
  rawFormValues: z.infer<typeof JobFormValidationSchema>
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "User not authenticated." };
  }
  const agentId = parseInt(session.user.id);

  // The rawFormValues are already validated by zodResolver against JobFormValidationSchema
  // Now, transform and prepare for CreateJobInternalSchema (and database)
  const transformedValues: CreateJobInput = {
    ...rawFormValues,
    assignedToId: rawFormValues.assignedToId
      ? parseInt(rawFormValues.assignedToId, 10)
      : undefined,
    customerId: rawFormValues.customerId
      ? parseInt(rawFormValues.customerId, 10)
      : undefined,
    // Ensure defaults are applied if optional fields were undefined in rawFormValues
    // Zod's .default() in JobFormValidationSchema handles status and checkInDate for the initial parse
    // but we re-assert them here for CreateJobInternalSchema if they were truly optional in FormInputValues
    status: rawFormValues.status || JobStatus.ITEM_RECEIVED,
    checkInDate: rawFormValues.checkInDate || new Date(),
    // Ensure optional URL strings are correctly handled if they were empty
    imageUrl1:
      rawFormValues.imageUrl1 === "" ? undefined : rawFormValues.imageUrl1,
    imageUrl2:
      rawFormValues.imageUrl2 === "" ? undefined : rawFormValues.imageUrl2,
    imageUrl3:
      rawFormValues.imageUrl3 === "" ? undefined : rawFormValues.imageUrl3,
  };

  const validatedFields = CreateJobInternalSchema.safeParse(transformedValues);
  if (!validatedFields.success) {
    console.error(
      "Internal Validation Errors after transformation:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      error: "Invalid job data.",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    customerId: existingCustomerId,
    customerName,
    customerPhone,
    customerEmail,
    customerAddress,
    ...jobData
  } = validatedFields.data;

  let finalCustomerId: number;

  try {
    if (existingCustomerId) {
      finalCustomerId = existingCustomerId;
    } else if (customerName && customerPhone) {
      // Find or create customer
      let customer = await prisma.customer.findFirst({
        where: {
          OR: [
            { phone: customerPhone },
            {
              email:
                customerEmail && customerEmail !== ""
                  ? customerEmail
                  : undefined,
            },
          ],
        },
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: customerName,
            phone: customerPhone,
            email: customerEmail,
            address: customerAddress,
          },
        });
      }
      finalCustomerId = customer.id;
    } else {
      return { error: "Customer information is missing." };
    }

    const newJob = await prisma.job.create({
      data: {
        ...jobData,
        customerId: finalCustomerId,
        createdById: agentId,
      },
    });

    revalidatePath("/dashboard/jobs"); // Revalidate the jobs list page
    return { success: "Job created successfully!", job: newJob };
  } catch (error) {
    console.error("Error creating job:", error);
    return { error: "Failed to create job. Please try again." };
  }
}

export async function updateJobAction(
  jobId: number,
  rawFormValues: z.infer<typeof JobFormValidationSchema>
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "User not authenticated." };
  }

  // Transform and prepare for UpdateJobInternalSchema (similar to CreateJobInternalSchema)
  // We can reuse CreateJobInternalSchema for the shape of data to update,
  // as it already handles ID parsing and defaults.
  const transformedValues: CreateJobInput = {
    ...rawFormValues,
    assignedToId: rawFormValues.assignedToId
      ? parseInt(rawFormValues.assignedToId, 10)
      : undefined,
    customerId: rawFormValues.customerId
      ? parseInt(rawFormValues.customerId, 10)
      : undefined,
    status: rawFormValues.status || JobStatus.ITEM_RECEIVED, // Ensure status is present
    checkInDate: rawFormValues.checkInDate || new Date(), // Ensure checkInDate is present
    imageUrl1:
      rawFormValues.imageUrl1 === "" ? undefined : rawFormValues.imageUrl1,
    imageUrl2:
      rawFormValues.imageUrl2 === "" ? undefined : rawFormValues.imageUrl2,
    imageUrl3:
      rawFormValues.imageUrl3 === "" ? undefined : rawFormValues.imageUrl3,
  };

  const validatedFields = CreateJobInternalSchema.safeParse(transformedValues);
  if (!validatedFields.success) {
    console.error(
      "Internal Validation Errors during update after transformation:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      error: "Invalid job data for update.",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    customerId: existingCustomerId,
    customerName,
    customerPhone,
    customerEmail,
    customerAddress,
    ...jobDataToUpdate // This contains all fields from CreateJobInternalSchema
  } = validatedFields.data;

  let finalCustomerId: number;

  try {
    // Customer handling logic (same as createJobAction)
    if (existingCustomerId) {
      finalCustomerId = existingCustomerId;
    } else if (customerName && customerPhone) {
      // Find or create logic (can be extracted to a helper function)
      let customer = await prisma.customer.findFirst({
        where: { phone: customerPhone },
      }); // Simplified find
      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: customerName,
            phone: customerPhone,
            email: customerEmail,
            address: customerAddress,
          },
        });
      }
      finalCustomerId = customer.id;
    } else {
      // This case should ideally be prevented by form validation if a new customer is being created.
      // If an existing customer ID was cleared and no new customer details provided, it's an issue.
      return { error: "Customer information is missing for update." };
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: { ...jobDataToUpdate, customerId: finalCustomerId },
    });

    revalidatePath("/dashboard/jobs");
    revalidatePath(`/dashboard/jobs/${jobId}`); // Revalidate the specific job detail page
    return { success: "Job updated successfully!", job: updatedJob };
  } catch (error) {
    console.error("Error updating job:", error);
    return { error: "Failed to update job. Please try again." };
  }
}

export async function deleteJobAction(jobId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    // Or check for ADMIN role if only admins can delete
    return { error: "User not authenticated or not authorized." };
  }

  try {
    await prisma.job.delete({
      where: { id: jobId },
    });

    revalidatePath("/dashboard/jobs"); // Revalidate the jobs list page
    return { success: "Job deleted successfully!" };
  } catch (error) {
    console.error("Error deleting job:", error);
    // Check for specific Prisma errors, e.g., record not found
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { error: "Job not found or already deleted." };
    }
    return { error: "Failed to delete job. Please try again." };
  }
}
