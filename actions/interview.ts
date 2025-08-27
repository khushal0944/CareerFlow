"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAi.getGenerativeModel({
    model: "gemini-1.5-flash",
});


export async function generateQuiz() {
	const { userId } = await auth();
	if (!userId) throw new Error("Unauthorized");

	const user = await db.user.findUnique({
		where: {
			clerkUserId: userId,
		},
	});
	if (!user) throw new Error("User not found");

	const prompt = `Generate 10 technical interview questions for a ${
		user.industry
	} professional${
		user.skills?.length
			? ` with expertise in ${user.skills.join(", ")}`
			: ""
	}.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }`;

    try {
        const res = await model.generateContent(prompt);
        const response = res.response.text();
        const cleanedText = response.replace(/```(?:json)?\n?/g, "").trim()
        const quiz = JSON.parse(cleanedText);
        return quiz.questions;
    } catch (error: any) {
        console.log("Error generating quiz questions: ", error?.message)
        throw new Error("Failed to generate quiz questions")
    }
}

export const saveQuizResult = async (questions: any[], answers: any[], score: any) => {
    const { userId } = await auth();
	if (!userId) throw new Error("Unauthorized");

	const user = await db.user.findUnique({
		where: {
			clerkUserId: userId,
		},
	});
	if (!user) throw new Error("User not found");

    const questionResults = questions.map((q, idx) => ({
        question: q.question,
        answer: q.correctAnswer,
        userAnswer: answers[idx],
        isCorrect: (q.correctAnswer === answers[idx]),
        explanation: q.explanation
    }))

    const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  // Only generate improvement tips if there are wrong answers
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
        const res = await model.generateContent(improvementPrompt)
        const response = res.response
        improvementTip = response.text().trim()
    } catch (error: any) {
        console.error("Error generating Improvement Tip: ", error?.message)
    }
  }

  try {
    const assessment = await db.assessment.create({
        data: {
            userId: user.id,
            questions: questionResults,
            quizScore: score,
            category: "Technical",
            improvementTip
        }
    })
    return assessment
  } catch (error) {
    console.log("Error saving quiz result: ", error)
    throw new Error("Failed to save quiz result")
  }
}
