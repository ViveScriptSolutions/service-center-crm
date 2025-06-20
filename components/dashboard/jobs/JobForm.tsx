"use client";

import { useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Job, Customer, User, JobStatus, PaymentStatus } from "@prisma/client"; // Import Prisma types

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createJobAction } from "@/actions/jobActions"; // Import schema and type
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { JobFormValidationSchema } from "@/lib/schemas/jobSchemas";

// The Zod schema is now imported from jobActions.ts
// const JobFormSchema = z.object({ ... });

// This type represents the data structure of the form fields as they are managed by react-hook-form.
// This should align with the *input* types that CreateJobSchema expects before transformations.
export type FormInputValues = {
  // Exporting can sometimes help with type inference in complex scenarios
  receiptNo: string;
  title: string;
  status?: JobStatus; // Optional in form, Zod schema will default it
  assignedToId?: string; // String from select
  checkInDate?: Date;
  printerBrand?: string;
  printerModel?: string;
  printerSerial?: string;
  accessoriesReceived?: string;
  imageUrl1?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  problemsReported: string;
  initialObservations?: string;
  notes?: string;
  customerId?: string; // In the form, this will be a string from the <select>
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
};

// CreateJobInput is the type AFTER Zod validation and transformation by CreateJobSchema
// type JobFormValues = CreateJobInput; // This was causing the issue

interface JobFormProps {
  job?: Job; // For editing (update logic not yet implemented with this action)
  customers: Customer[];
  technicians: User[];
}

export function JobForm({ job, customers, technicians }: JobFormProps) {
  // JobFormValues here is the type of the data passed to onSubmit
  const router = useRouter();
  const [formError, setFormError] = useState<string | undefined>("");
  const [formSuccess, setFormSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showNewCustomerFields, setShowNewCustomerFields] = useState(
    !job?.customerId
  ); // Show if no existing customer selected

  const form = useForm<FormInputValues>({
    // Use the form field specific type
    resolver: zodResolver(JobFormValidationSchema), // Use the form-specific validation schema
    defaultValues: job
      ? {
          // Simplified for create, edit needs more thought with this structure
          ...job,
          customerId: job.customerId ? String(job.customerId) : undefined,
          assignedToId: job.assignedToId ? String(job.assignedToId) : undefined,
          receiptNo: job.receiptNo || "",
          title: job.title || "",
          status: job.status || JobStatus.ITEM_RECEIVED,
          checkInDate: job.checkInDate || new Date(),
          printerBrand: job.printerBrand || "",
          printerModel: job.printerModel || "",
          printerSerial: job.printerSerial || "",
          accessoriesReceived: job.accessoriesReceived || "",
          imageUrl1: job.imageUrl1 || "",
          imageUrl2: job.imageUrl2 || "",
          imageUrl3: job.imageUrl3 || "",
          problemsReported: job.problemsReported || "",
          initialObservations: job.initialObservations || "",
          notes: job.notes || "",
          // Customer fields are not directly part of 'job' for defaultValues here
          // They are handled by the 'customerId' or new customer input fields
          // Explicitly set potentially undefined new customer fields for type consistency
          customerName: undefined,
          customerPhone: undefined,
          customerEmail: undefined,
          customerAddress: undefined,
        }
      : {
          status: JobStatus.ITEM_RECEIVED,
          checkInDate: new Date(), // Zod schema defaults this if undefined, but good to set in form
          receiptNo: `JOB-${format(new Date(), "yyyyMMdd")}-`, // Suggest a receipt number
          title: "",
          problemsReported: "",
          // Explicitly initialize all other optional fields in JobFormFieldValues
          assignedToId: undefined,
          printerBrand: "",
          printerModel: "",
          printerSerial: "",
          accessoriesReceived: "",
          imageUrl1: "",
          imageUrl2: "",
          imageUrl3: "",
          initialObservations: "",
          notes: "",
          customerId: undefined,
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          customerAddress: "",
        },
  });

  // The `values` parameter here will be of type `z.infer<typeof JobFormValidationSchema>`
  // because `zodResolver` uses JobFormValidationSchema.
  const onSubmit: SubmitHandler<FormInputValues> = (values) => {
    // Even though SubmitHandler is typed with FormInputValues,
    // zodResolver ensures `values` here is actually z.infer<typeof JobFormValidationSchema>
    // zodResolver has already processed and transformed the form data.
    setFormError("");
    setFormSuccess("");

    startTransition(async () => {
      // For now, we are only implementing create. Edit would need a separate action or logic.
      if (job) {
        setFormError(
          "Editing existing jobs via this form is not yet implemented."
        );
        return;
      }
      // The `values` here are JobFormFieldValues.
      // The createJobAction expects CreateJobInput (which is after Zod transformation).
      // ZodResolver handles this: it takes form values, validates/transforms using CreateJobSchema, then passes the transformed data.
      const result = await createJobAction(
        values as z.infer<typeof JobFormValidationSchema>
      ); // Cast needed because onSubmit's 'values' is FormInputValues
      // but createJobAction expects the Zod schema's output.

      if (result.error) {
        setFormError(
          result.error +
            (result.details
              ? ` Details: ${JSON.stringify(result.details, null, 2)}`
              : "")
        );
      } else {
        setFormSuccess(result.success);
        router.push("/dashboard/jobs");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info Section */}
        <h3 className="text-lg font-medium border-b pb-2">Job Details</h3>
        <FormField
          control={form.control}
          name="receiptNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Receipt No.</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="checkInDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Check-in Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <h3 className="text-lg font-medium border-b pb-2 mt-6">
          Customer Information
        </h3>
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Existing Customer (Optional)</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setShowNewCustomerFields(!value); // Hide new customer fields if existing is selected
                  if (value) {
                    // Clear new customer fields if existing is selected
                    form.setValue("customerName", "");
                    form.setValue("customerPhone", "");
                    form.setValue("customerEmail", "");
                    form.setValue("customerAddress", "");
                  }
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an existing customer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="--new-customer--">
                    {" "}
                    {/* Use a non-empty unique value */}
                    <em>-- None (Enter New Customer Below) --</em>
                  </SelectItem>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name} ({c.phone})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                If you select an existing customer, you don't need to fill the
                fields below.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {showNewCustomerFields && (
          <>
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Customer Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Customer Phone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="123-456-7890" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Customer Email (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      placeholder="john.doe@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Customer Address (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="123 Main St, Anytown, USA"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <h3 className="text-lg font-medium border-b pb-2 mt-6">
          Device & Problem Details
        </h3>
        <FormField
          control={form.control}
          name="printerBrand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Printer Brand</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="printerModel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Printer Model</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="printerSerial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Printer Serial</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accessoriesReceived"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accessories Received</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="e.g., Power cable, USB cable, 1 ink cartridge"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="problemsReported"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Problems Reported by Customer</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="initialObservations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Observations by Agent</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h3 className="text-lg font-medium border-b pb-2 mt-6">
          Assignment & Status
        </h3>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(JobStatus).map((statusVal) => (
                    <SelectItem key={statusVal} value={statusVal}>
                      {statusVal.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="assignedToId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign to Technician (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a technician" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="--unassigned--">
                    {" "}
                    {/* Use a non-empty unique value */}
                    <em>-- Unassigned --</em>
                  </SelectItem>
                  {technicians.map((tech) => (
                    <SelectItem key={tech.id} value={String(tech.id)}>
                      {tech.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <h3 className="text-lg font-medium border-b pb-2 mt-6">
          Images (Optional URLs)
        </h3>
        <FormField
          control={form.control}
          name="imageUrl1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL 1</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://example.com/image1.jpg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL 2</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://example.com/image2.jpg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl3"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL 3</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://example.com/image3.jpg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h3 className="text-lg font-medium border-b pb-2 mt-6">
          Additional Notes
        </h3>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Internal Notes</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {formError && <p className="text-sm text-destructive">{formError}</p>}
        {formSuccess && (
          <p className="text-sm text-emerald-500">{formSuccess}</p>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending
            ? job
              ? "Saving..."
              : "Creating..."
            : job
            ? "Save Changes"
            : "Create Job"}
        </Button>
      </form>
    </Form>
  );
}
