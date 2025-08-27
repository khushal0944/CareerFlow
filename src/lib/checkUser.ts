import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
	try {
		const user = await currentUser();
		if (!user) return null;

		const loggedInUser = await db.user.findUnique({
			where: { clerkUserId: user.id },
		});
		if (loggedInUser) return loggedInUser;

		const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
		const email = user.emailAddresses?.[0]?.emailAddress || "";

		const createUser = await db.user.create({
			data: {
				clerkUserId: user.id,
				name,
				email,
				imageUrl: user.imageUrl,
			},
		});

		return createUser;
	} catch (error: any) {
		console.error("checkUser error:", error);
		throw error; // Let it bubble up to see the actual error in Next.js
	}
};
