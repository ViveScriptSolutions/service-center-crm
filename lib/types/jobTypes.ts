import { JobStatus } from "@prisma/client";

// This type represents the data structure of the form fields as they are managed by react-hook-form
// for the Job form.
export type JobFormInputValues = {
  receiptNo: string;
  title: string;
  status?: JobStatus;
  assignedToId?: string;
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
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
};
