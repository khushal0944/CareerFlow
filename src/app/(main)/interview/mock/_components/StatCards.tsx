import React from "react";
import { AssessmentType } from "../../page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrophyIcon } from "lucide-react";

const StatCards = ({ assessment }: { assessment: AssessmentType[] }) => {
	const getAvgScore = () => {
		if (assessment?.length === 0) return 0;
		const sum = assessment.reduce((sum, eachAss) => {
			return sum + eachAss.quizScore;
		}, 0);

		return (sum / assessment.length).toFixed(1);
	};

	const getLatestScore = () => {
		if (assessment?.length === 0) return 0;
		return assessment[0].quizScore;
	};

	const getTotalQuestions = () => {
		if (assessment?.length === 0) return 0;
		return assessment.reduce(
			(sum, eachAss) => sum + eachAss.questions.length,
			0
		).toFixed(1);
	};

	return (
		<div className="grid gap-6 md:grid-cols-3">
			<Card className="bg-background hover:scale-105 hover:border hover:border-white transition">
				<CardHeader className="flex justify-between items-center space-y-0 ">
					<CardTitle>Average score</CardTitle>
					<TrophyIcon className="text-muted-foreground h-4 w-4" />
				</CardHeader>
				<CardContent>
					<h1 className="text-2xl font-bold">{getAvgScore() || 0}%</h1>
					<p className="text-xs text-muted-foreground">
						Across all assessments
					</p>
				</CardContent>
			</Card>
			<Card className="bg-background hover:scale-105 hover:border hover:border-white transition">
				<CardHeader className="flex justify-between items-center space-y-0 ">
					<CardTitle>Questions practised</CardTitle>
					<Brain className="text-muted-foreground h-4 w-4" />
				</CardHeader>
				<CardContent>
					<h1 className="text-2xl font-bold">
						{getTotalQuestions() || 0}
					</h1>
					<p className="text-xs text-muted-foreground">
						Total questions
					</p>
				</CardContent>
			</Card>
			<Card className="bg-background hover:scale-105 hover:border hover:border-white transition">
				<CardHeader className="flex justify-between items-center space-y-0 ">
					<CardTitle>Latest score</CardTitle>
					<TrophyIcon className="text-muted-foreground h-4 w-4" />
				</CardHeader>
				<CardContent>
					<h1 className="text-2xl font-bold">{getLatestScore() || 0}%</h1>
					<p className="text-xs text-muted-foreground">
						Most recent quiz
					</p>
				</CardContent>
			</Card>
		</div>
	);
};

export default StatCards;
