export interface salaryType {
	role: string;
	min: number;
	max: number;
	median: number;
}

export interface insightsType {
	id: String;
	industry: String;
	users: any[];
	salaryRanges: salaryType[];
	growthRate: number;
	topSkills: String[];
	demandLevel: "MEDIUM" | "LOW" | "HIGH";
	marketOutlook: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
	keyTrends: String[];
	recommendedSkills: String[];
	lastUpdated: Date;
	nextUpdated: Date;
}
