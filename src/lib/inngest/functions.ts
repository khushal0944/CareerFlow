import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../prisma";
import { inngest } from "./client";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAi.getGenerativeModel({
	model: "gemini-1.5-flash",
});
export const helloWorld = inngest.createFunction(
	{ id: "hello-world" },
	{ event: "test/hello.world" },
	async ({ event, step }) => {
		await step.sleep("wait-a-moment", "1s");
		console.log("Welcome to INNGEST");
		return { message: `Hello ${event.data.email}!` };
	}
);

export const generateIndustryInsights = inngest.createFunction(
	{ id: "generate-industry-insights", name: "Generate Industry Insights" },
	{ cron: "0 0 * * 0" },
	async ({ step }) => {
		const industries = await step.run("Fetch industries", async () => {
			const res =  await db.industryInsight.findMany({
				select: {
					industry: true,
				},
			});
            console.log(res);
            return res;
		});

		for (const { industry } of industries) {
			const prompt = `Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "HIGH" | "MEDIUM" | "LOW",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.`;

			const res: any = await step.ai.wrap(
				"gemini",
				async (p) => {
					return await model.generateContent(p);
				},
				prompt
			);

			console.log(res);
			const text: string = res.response?.candidates[0]?.content.parts[0]?.text || ""
            const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim()
            const insights = JSON.parse(cleanedText);
            
            await step.run(`Update ${industry} insights`, async () => {
                await db.industryInsight.update({
                    where: {
                        industry
                    },
                    data: {
                        ...insights,
                        lastUpdated: new Date(),
                        nextUpdated: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    }
                })
            })
		}
	}
);