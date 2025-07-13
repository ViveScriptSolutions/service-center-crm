import * as z from "zod";

export const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").optional(),
  image: z.string().url("Must be a valid URL.").optional().or(z.literal("")),
});
