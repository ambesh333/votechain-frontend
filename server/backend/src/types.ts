import z from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid end date",
  }),
  options: z.array(z.string()).min(1, "At least one option is required"),
  invitedUsers: z.array(z.string()).optional(),
});

export const voteSchema = z.object({
  eventId: z.number().int().positive(),
  optionId: z.number().int().positive(),
});
