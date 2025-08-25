import {z} from 'zod'

export const onBoardingSchema = z.object({
    industry: z.string({
        required_error: "Please select an industry"
    }),
    subindustry: z.string({
        required_error: "Please select a specialization"
    }),
    bio: z.string().max(500).trim().optional(),
    experience: z.string().transform(val => parseInt(val, 10)).pipe(z.number().min(0, "Experience must be atleast 0 years").max(50, "Experience cannot exceeds 50 years")),
    skills: z.string().transform(val => val ? val.split(",").map(skill => skill.trim()).filter(Boolean) : undefined)
})