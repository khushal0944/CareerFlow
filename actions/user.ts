"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function updateUser(data: any) {
    const {userId} = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })
    if (!user) throw new Error("User not found");

    try {
        const result = await db.$transaction(async (tx) => {
            let industryInsight = await tx.industryInsight.findUnique({
				where: {
					industry: data.industry,
				},
			});

            if (!industryInsight) {
                industryInsight = await tx.industryInsight.create({
					data: {
						industry: data.industry,
						salaryRanges: [],
						growthRate: 0,
						demandLevel: "MEDIUM",
						marketOutlook: "NEUTRAL",
						topSkills: [],
						keyTrends: [],
						recommendedSkills: [],
						nextUpdated: new Date(
							Date.now() + 7 * 24 * 60 * 60 * 1000
						),
					},
				});
            }

            const updatedUser = await tx.user.update({
                where: {
                    id: user.id
                },
                data: {
                    bio: data.bio,
                    industry: data.industry,
                    experience: data.experience,
                    skills: data.skills,
                }
            })

            return {updatedUser, industryInsight}
        }, {
            timeout: 10000
        })
        console.log("Result in user.ts file - ", result)
        return {success: true, ...result}
    } catch (error) {
        console.error("Error updating user and industry: ", (error as Error).message)
        throw new Error("Failed updating user profile")
    }
}


export async function getUserOnboardingStatus() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized")
    
    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })

    if (!user) throw new Error("User not found")
        console.log("Printing user in user.ts actions file - ", user)
    
        try {
            const user = await db.user.findUnique({
                where: {
                    clerkUserId: userId
            },
            select: {
                industry: true
            }
        })
        console.log("Printing user with industry in user.ts actions file - ", user)

        return {
            isOnboarded: !!user?.industry
        }
    } catch (error) {
        console.error("Error checking onboarding status: ", error);
        throw new Error("Failed to check onboarding status");
    }
}