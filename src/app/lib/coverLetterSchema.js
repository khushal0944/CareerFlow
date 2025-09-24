import z from "zod";

export const coverLetterSchema = z.object({
	jobDescription: z
		.string()
		.min(10, "Min 10 chars for job description"),
	companyName: z.string().min(3),
	jobTitle: z.string().min(3),
});