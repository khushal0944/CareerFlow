"use server";
import { CoverLetterType } from "@/app/(main)/cover-letter/page";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAi.getGenerativeModel({
	model: "gemini-1.5-flash"
});

/*
Demo Data

[
    {
        "id": "0c939fea-c3c6-4103-94e7-10bcb9f4asda",
        "userId": "0c939fea-c3c6-4103-94e7-10bcb9f4ad4c",
        "content": "This is testing cover letter",
        "jobDescription": "testing",
        "companyName": "test",
        "jobTitle": "test",
        "createdAt": "2025-08-31T06:28:55.627Z",
        "updatedAt": "2025-08-31T06:28:55.627Z"
    }
]
*/

export async function getAllCoverLetters() {
	const { userId } = await auth();
	if (!userId) throw new Error("Unauthorized");

	const user = await db.user.findUnique({
		where: {
			clerkUserId: userId,
		},
	});

	if (!user) throw new Error("User not found");

	try {
		return await db.coverLetter.findMany({
			where: {
				userId: user.id,
			},
            orderBy: {
                createdAt: "desc",
            }
		});
	} catch (error) {
		console.error("Error fetching cover letters", (error as Error).message);
		throw new Error("Error fetching cover letters");
	}
}

export async function generateAICoverLetter(data: CoverLetterType) {
	const { userId } = await auth();
	if (!userId) throw new Error("Unauthorized");

	const user = await db.user.findUnique({
		where: {
			clerkUserId: userId,
		},
	});

	if (!user) throw new Error("User not found");
	try {
        const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${
			data.companyName
		}.
    
    About the candidate:
    - Industry: ${user.industry}
    - Years of Experience: ${user.experience}
    - Skills: ${user.skills?.join(", ")}
    - Professional Background: ${user.bio}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
    
    Format the letter in markdown.
  `;

        const result = await model.generateContent(prompt)
        const content = result.response.text().trim();
        console.log("response text", content);

        const res = await db.coverLetter.create({
            data: {
                userId: user.id,
                companyName: data.companyName,
                jobTitle: data.jobTitle,
                jobDescription: data.jobDescription,
                content,
                createdAt: new Date(Date.now()),
            }
        })
        console.log(res)

        return res;
	} catch (error) {
        console.error("Error generating cover letter" ,(error as Error).message)
        throw new Error("Error generating cover letter")
    }
}


export async function getCoverLetter(id: string) {
    	const { userId } = await auth();
		if (!userId) throw new Error("Unauthorized");

		const user = await db.user.findUnique({
			where: {
				clerkUserId: userId,
			},
		});

		if (!user) throw new Error("User not found");

        try {
            return await db.coverLetter.findUnique({
                where: {
                    id,
                    userId: user.id
                }
            })
        } catch (error: any) {
            console.error(`Error fetching Cover letter with id ${id} - ${error.message}`)
        }
}

export async function deleteCoverLetterWithId(id: string) {
    const { userId } = await auth();
	if (!userId) throw new Error("Unauthorized");

	const user = await db.user.findUnique({
		where: {
			clerkUserId: userId,
		},
	});

	if (!user) throw new Error("User not found");
    try {
        return await db.coverLetter.delete({
            where: {
                id,
                userId: user.id
            }
        })
    } catch (error: any) {
            console.error(
				`Error Deleting Cover letter with id ${id} - ${error.message}`
			);
        
    }
}