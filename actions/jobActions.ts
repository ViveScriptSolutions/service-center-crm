"use server";

import * as z from "zod";
import prisma from "@/lib/prisma";
import { JobStatus } from "@prisma/client";
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
    title: rawFormValues.title, // Keep as is, will handle default below
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

  // Construct default title if not provided
  let finalTitle = jobData.title;
  if (!finalTitle) {
    const printerInfo = [
      jobData.printerBrand,
      jobData.printerModel,
      jobData.printerSerial,
    ]
      .filter(Boolean) // Remove empty/null values
      .join(" ");
    const problemSnippet = jobData.problemsReported.substring(0, 30); // First 30 chars
    finalTitle = `${printerInfo ? printerInfo + ": " : ""}${problemSnippet}${
      jobData.problemsReported.length > 30 ? "..." : ""
    }`;
  }

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
        title: finalTitle, // Use the potentially defaulted title
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
