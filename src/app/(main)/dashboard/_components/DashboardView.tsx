"use client"
import React from "react";
import { insightsType } from "./types";
import { format, formatDistanceToNow } from "date-fns";
import {
	Brain,
	Briefcase,
	LineChart,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	ResponsiveContainer,
	BarChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Bar,
	Rectangle,
} from "recharts";

const DashboardView = ({ insights }: { insights: insightsType }) => {
	const salaryData = insights.salaryRanges.map((each) => ({
		name: each.role,
		min: each.min / 1000,
		max: each.max / 1000,
		median: each.median / 1000,
	}));
	const getDemandLevelColor = (level: string) => {
		switch (level.toLowerCase()) {
			case "high":
				return "bg-green-500";
			case "medium":
				return "bg-yellow-500";
			case "low":
				return "bg-red-500";
			default:
				return "bg-gray-500";
		}
	};
	const getMarketOutlookInfo = (outlook: string) => {
		switch (outlook.toLowerCase()) {
			case "positive":
				return { icon: TrendingUp, color: "text-green-500" };
			case "neutral":
				return { icon: LineChart, color: "text-yellow-500" };
			case "negative":
				return { icon: TrendingDown, color: "text-red-500" };
			default:
				return { icon: LineChart, color: "text-gray-500" };
		}
	};

	const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
	const OutlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

	const lastUpdatedDate = format(
		new Date(insights.nextUpdated),
		"dd/MM/yyyy"
	);

	const nextUpdatedDate = formatDistanceToNow(
		new Date(insights.nextUpdated),
		{ addSuffix: true }
	);
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<Badge variant={"outline"} className="py-1 px-2">
					Last updated on: {lastUpdatedDate}
				</Badge>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
				<Card className="bg-background hover:scale-105 hover:border hover:border-white transition">
					<CardHeader className="flex justify-between items-center space-y-0 pb-2">
						<CardTitle>Market Outlook</CardTitle>
						<OutlookIcon className={`w-4 h-4 ${OutlookColor}`} />
					</CardHeader>
					<CardContent>
						<h1 className="text-2xl font-bold">
							{insights.marketOutlook}
						</h1>
						<p className="text-xs text-muted-foreground">
							Next updated in {nextUpdatedDate}
						</p>
					</CardContent>
				</Card>

				<Card className="bg-background hover:scale-105 hover:border hover:border-white transition flex flex-col">
					<CardHeader className="flex justify-between items-center space-y-0 pb-1">
						<CardTitle>Indutry Growth</CardTitle>
						<TrendingUp
							className={`w-4 h-4 text-muted-foreground`}
						/>
					</CardHeader>
					<CardContent>
						<h1 className="text-2xl font-bold">
							{insights.growthRate.toFixed(1)}%
						</h1>
						<Progress
							className="mt-2"
							value={insights.growthRate}
						/>
					</CardContent>
				</Card>
				<Card className="bg-background hover:scale-105 hover:border hover:border-white transition">
					<CardHeader className="flex justify-between items-center space-y-0 pb-1">
						<CardTitle>Demand Level</CardTitle>
						<Briefcase
							className={`w-4 h-4 text-muted-foreground`}
						/>
					</CardHeader>
					<CardContent>
						<h1 className="text-2xl font-bold">
							{insights.demandLevel}
						</h1>
						<div
							className={`w-full h-2 rounded-full ${getDemandLevelColor(
								insights.demandLevel
							)} mt-2`}
						/>
					</CardContent>
				</Card>
				<Card className="bg-background hover:scale-105 hover:border hover:border-white transition">
					<CardHeader className="flex justify-between items-center space-y-0 pb-2">
						<CardTitle>Top Skills</CardTitle>
						<Brain className={`w-4 h-4 text-muted-foreground`} />
					</CardHeader>
					<CardContent className="flex flex-wrap gap-1">
						{insights.topSkills.map((skill, idx) => {
							return (
								<Badge key={idx} variant={"secondary"}>
									{skill}
								</Badge>
							);
						})}
					</CardContent>
				</Card>
			</div>

			<div className="w-full">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-xl">
							Salaries Ranges by Role
						</CardTitle>
						<CardDescription className="text-muted-foreground">
							Displaying minimum, maximum and median salary (in
							Thousands)
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div
							className="h-[400px] w-full"
						>
							<ResponsiveContainer width="100%" height="100%">
								<BarChart
									data={salaryData}
									margin={{
										bottom: 80,
									}}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis
										dataKey="name"
										interval={0}
										tick={{ fontSize: 12 }}
										angle={-30}
										textAnchor="end"
										dy={10}
									/>
									<YAxis />
									<Tooltip
										content={({
											active,
											payload,
											label,
										}) => {
											if (
												active &&
												payload &&
												payload.length
											) {
												return (
													<div className="bg-background border rounded-lg p-5 shadow-md">
														<p className="font-medium text-xl">
															{label}
														</p>
														{payload.map((item) => (
															<p
																key={item.name}
																className="text-sm"
															>
																{`${
																	item.name
																		.charAt(
																			0
																		)
																		.toUpperCase() +
																	item.name.slice(
																		1
																	)
																} Salary (K): $${
																	item.value
																}K`}
															</p>
														))}
													</div>
												);
											}
											return null;
										}}
									/>
									<Bar
										dataKey="min"
										fill="#8884d8"
										activeBar={<Rectangle fill="#6a7282" />}
									/>
									<Bar
										dataKey="max"
										fill="#82ca9d"
										activeBar={<Rectangle fill="#4a5565" />}
									/>
									<Bar
										dataKey="median"
										fill="#55ca9d"
										activeBar={<Rectangle fill="#364153" />}
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Card className="bg-background">
					<CardHeader className="text-xl">
						<CardTitle>Key Industry Trends</CardTitle>
						<CardDescription>
							Current trends shaping the industry
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-2">
						<ul className="list-disc pl-5 space-y-2">
							{insights.keyTrends.map((skill, idx) => {
								return <li key={idx}>{skill}</li>;
							})}
						</ul>
					</CardContent>
				</Card>

				<Card className="bg-background">
					<CardHeader className="text-xl">
						<CardTitle>Recommended Skills</CardTitle>
						<CardDescription>
							Skills to consider developing
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-2">
						{insights.recommendedSkills.map((skill, idx) => {
							return (
								<Badge variant={"outline"} key={idx}>
									{skill}
								</Badge>
							);
						})}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default DashboardView;
