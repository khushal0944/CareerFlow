import React from "react";
import { getUserOnboardingStatus } from "@/../actions/user";
import { redirect } from "next/navigation";
import DashboardView from "./_components/DashboardView";
import { getIndustryInsights } from "@/../actions/dashboard";
import { insightsType } from "./_components/types";

const IndustryInsightsPage = async () => {
	const { isOnboarded } = await getUserOnboardingStatus();

	if (!isOnboarded) {
		redirect("/onboarding");
	}
	const insights: insightsType = await getIndustryInsights();

	return <DashboardView insights={insights} />;
};

export default IndustryInsightsPage;
