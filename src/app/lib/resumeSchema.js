import z from "zod";

export const entrySchema = z.object({
	title: z.string().min(1, "Title is required"),
	company: z.string().min(1, "Company name is required"),
	startDate: z.string().min(1, "Start date is required"),
	endDate: z.string().optional(),
	currentExp: z.boolean().default(false),
	description: z.string().min(1, "description is required"),
}).refine((data) => {
    if (!data.currentExp && !data.endDate) return false;
    return true;
}, {
    message: "End date is required unless it is your current position",
    path: ["endDate"]
});

const contactSchema = z.object({
	email: z.email(),
	mobile: z
		.string()
		.min(10, "Phone no must be 10 digits")
		.max(10, "Phone no must be 10 digits")
		.optional(),
	linkedinUrl: z.url().optional(),
	githubUrl: z.url().optional(),
});

export const resumeSchema = z.object({
    contact: contactSchema,
	summary: z.string().max(200),
	skills: z.string().min(1, "Skills is required"),
	experience: z.array(entrySchema),
	education: z.array(entrySchema),
	projects: z.array(entrySchema),
});