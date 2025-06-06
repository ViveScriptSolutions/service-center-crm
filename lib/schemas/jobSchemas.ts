import * as z from "zod";
import { JobStatus } from "@prisma/client";

// Define the base object schema first
export const BaseJobFormSchema = z.object({
  // Job Details
  receiptNo: z.string().min(1, "Receipt number is required."),
  title: z.string().min(1, "Job title is required."),
  status: z.nativeEnum(JobStatus).default(JobStatus.ITEM_RECEIVED),
  assignedToId: z.string().optional(), // Stays string
  checkInDate: z
    .date()
    .optional()
    .default(() => new Date()),
  printerBrand: z.string().optional(),
  printerModel: z.string().optional(),
  printerSerial: z.string().optional(),
  accessoriesReceived: z.string().optional(),
  imageUrl1: z.string().url().optional().or(z.literal("")),
  imageUrl2: z.string().url().optional().or(z.literal("")),
  imageUrl3: z.string().url().optional().or(z.literal("")),
  problemsReported: z
    .string()
    .min(1, "Problems reported by customer is required."),
  initialObservations: z.string().optional(),
  notes: z.string().optional(),

  // Customer Handling
  customerId: z.string().optional(), // Stays string
  // New Customer Details (only if customerId is not provided)
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email().optional().or(z.literal("")),
  customerAddress: z.string().optional(),
});

// Now, apply .refine() to the base schema to create the validation schema
export const JobFormValidationSchema = BaseJobFormSchema.refine(
  (data) => {
    // If customerId is not provided, then new customer details must be
    if (!data.customerId && (!data.customerName || !data.customerPhone)) {
      return false;
    }
    return true;
  },
  {
    message:
      "Either select an existing customer or provide new customer name and phone.",
    path: ["customerId"], // Or a more general path
  }
);

// This type represents the data AFTER it has been processed and IDs are numbers.
// It's what your database interaction and core logic will expect.
export const CreateJobInternalSchema = BaseJobFormSchema.extend({
  // Extend the base object schema
  assignedToId: z.number().optional(),
  customerId: z.number().optional(),
  checkInDate: z.date(), // Ensure it's a date
  status: z.nativeEnum(JobStatus), // Ensure it's a JobStatus
});
export type CreateJobInput = z.infer<typeof CreateJobInternalSchema>; // Infer from the correct internal schema
