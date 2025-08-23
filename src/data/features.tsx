import { BrainCircuit, Briefcase, LineChart, ScrollText } from "lucide-react";
import { ReactNode } from "react";

interface featuresType {
    icon: ReactNode;
    title: string;
    description: string
}

export const features: featuresType[] = [
	{
		icon: <BrainCircuit className="w-10 h-10 mb-4 text-primary" />,
		title: "AI-Powered Career Guidance",
		description:
			"Get personalized career advice and insights powered by advanced AI technology.",
	},
	{
		icon: <Briefcase className="w-10 h-10 mb-4 text-primary" />,
		title: "Interview Preparation",
		description:
			"Practice with role-specific questions and get instant feedback to improve your performance.",
	},
	{
		icon: <LineChart className="w-10 h-10 mb-4 text-primary" />,
		title: "Industry Insights",
		description:
			"Stay ahead with real-time industry trends, salary data, and market analysis.",
	},
	{
		icon: <ScrollText className="w-10 h-10 mb-4 text-primary" />,
		title: "Smart Resume Creation",
		description: "Generate ATS-optimized resumes with AI assistance.",
	},
];