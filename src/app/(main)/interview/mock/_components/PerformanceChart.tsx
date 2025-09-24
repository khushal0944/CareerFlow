"use client";
import React, { useEffect, useState } from "react";
import { AssessmentType } from "../../page";
import { format } from "date-fns";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const PerformanceChart = ({ assessment }: { assessment: AssessmentType[] }) => {
	const [chartsData, setChartsData] = useState<object[]>([]);

	useEffect(() => {
		if (assessment) {
			const formattedData = assessment.map((each: AssessmentType) => ({
					date: format(new Date(each.createdAt), "MMM dd"),
					score: each.quizScore,
				})
			);
            setChartsData(formattedData)
		}
	}, [assessment]);
	return (
		<Card>
			<CardHeader>
				<CardTitle className="gradient-title text-3xl md:text-4xl">
					Performance trends
				</CardTitle>
				<CardDescription>Your quiz scores over time</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="h-[300px]">
					<ResponsiveContainer width={"100%"} height={"100%"}>
						<LineChart data={chartsData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis domain={[0, 100]} />
							<Tooltip
								content={({ active, payload }) => {
                                    console.log(payload)
									if (active && payload?.length) {
										console.log(payload[0].value);
										return (
											<div className="p-4 rounded bg-background shadow-md border">
												<p className="font-medium ">
													Score: {payload[0].value}%
												</p>
												<p className="text-xs text-muted-foreground">
													{payload[0].payload.date}
												</p>
											</div>
										);
									}
								}}
							/>
							<Line
								type="monotone"
								dataKey="score"
								stroke={"#82ca9d"}
								strokeWidth={2}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
};

export default PerformanceChart;
