"use server"
import { db } from "@/lib/prisma";
import { auth, Organization } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAi.getGenerativeModel({
    model: "gemini-1.5-flash"
})

export async function saveResume(content: string) {
	const { userId } = await auth();
	if (!userId) throw new Error("Unauthorized");

	const user = await db.user.findUnique({
		where: {
			clerkUserId: userId,
		},
	});

	console.log(user);
	if (!user) throw new Error("User not found");

	try {
		const resume = await db.resume.upsert({
			where: {
				userId: user.id,
			},
			update: {
				content: content,
				updatedAt: new Date(),
			},
			create: {
				content: content,
				createdAt: new Date(),
				userId: user.id,
			},
		});

		revalidatePath("/resume");

		return resume;
	} catch (error: any) {
		console.log("Error saving resume", error.message);
		throw new Error("Error saving resume");
	}
}

export async function getResume() {
	const { userId } = await auth();
	if (!userId) throw new Error("Unauthorized");

	const user = await db.user.findUnique({
		where: {
			clerkUserId: userId,
		},
	});

	console.log(user);
	if (!user) throw new Error("User not found");

	try {
        const resume = await db.resume.findUnique({
            where: {
                userId: user.id
            }
        })

        return resume;  
	} catch (error: any) {
        console.log("Error fetching resume: ", error.message)
        throw new Error("Error fetching resume")
    }
}

export async function improveWithAi({content, type}: {content: {
    description: string;
    organization?: string;
}, type: string}) {
    	const { userId } = await auth();
		if (!userId) throw new Error("Unauthorized");

		const user = await db.user.findUnique({
			where: {
				clerkUserId: userId,
			},
		});

		console.log(user);
		if (!user) throw new Error("User not found");

        try {
            const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${content.description}"
    Current Organization: "${content.organization}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed in around 40-50 words
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    7. Answer in more realistic manner so no one knows that its fake
    
    Format the response as a single paragraph without any additional text or explanations.
  `;
            const data = await model.generateContent(prompt)
            console.log(data.response)
            const response = data.response.text().trim();
            console.log("response", response)
            return response
        } catch (error: any) {
            console.error(`Error improving ${type} data: ${error.message}`);
            throw new Error("Error improving data: ")
        }
}