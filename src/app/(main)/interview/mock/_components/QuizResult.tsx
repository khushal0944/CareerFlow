// 1:20 mins to complete

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {  CheckCircle2, Trophy, XCircle } from 'lucide-react';
import React from 'react'

interface QuizData {
	id: string;
	userId: string;
	quizScore: number;
	questions: Question[];
	category: string;
	improvementTip?: string | null;
	createdAt: Date; // ISO date string
	updatedAt: Date; // ISO date string
}

interface Question {
	answer: string;
	question: string;
	isCorrect: boolean;
	userAnswer: string;
	explanation: string;
}


const QuizResult = ({
	result,
	hideStartNew = false,
	onStartNew,
	className,
}: {
	result: QuizData;
	hideStartNew?: boolean;
	onStartNew?: (...args: any) => any;
    className ?: string
}) => {
	if (!result) return null;
	return (
		<Card className={`mx-auto ${className}`}>
			<div className=" flex justify-center items-center gap-3">
				<Trophy className="w-6 h-6 text-yellow-400" />
				<h1 className="text-3xl font-bold">Quiz Results</h1>
			</div>

			<CardContent className="space-y-3">
				<h1 className={`text-xl text-center font-semibold`}>
					Score:{" "}
					<span
						className={`${
							result.quizScore < 50
								? "text-red-500"
								: "text-green-500"
						}`}
					>
						{result.quizScore.toFixed(1)}%
					</span>
				</h1>
				<Progress value={result.quizScore} />

				{result.improvementTip && (
					<div className="p-2 bg-muted/50 border-2 rounded-xl">
						<h1 className="text-lg font-bold">Improvement Tip: </h1>
						<p className="text-muted-foreground">
							{result.improvementTip}
						</p>
					</div>
				)}

				<h1 className="text-xl font-bold">Questions review</h1>
				{result.questions.map((q, index) => {
					return (
						<Card key={index}>
							<CardContent className="" key={index}>
								<h1 className="font-semibold flex gap-2 items-center mb-1 justify-between">
									<span>
										Q{index + 1}. {q.question}
									</span>{" "}
									{q.isCorrect ? (
										<CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
									) : (
										<XCircle className="h-5 w-5 text-red-500 shrink-0" />
									)}
								</h1>
								<p className="text-muted-foreground">
									Your answer: {q.userAnswer}
								</p>
								{!q.isCorrect && (
									<p className="text-muted-foreground">
										Correct answer: {q.answer}
									</p>
								)}
								<div className="p-2 bg-muted/50 border-2 rounded mt-4">
									Explaination: <br />
									<span className="text-sm text-muted-foreground tracking-tight">
										{q.explanation}
									</span>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</CardContent>
			<CardFooter>
				{!hideStartNew && (
					<Button className="w-full" onClick={onStartNew}>
						Start new quiz
					</Button>
				)}
			</CardFooter>
		</Card>
	);
};

export default QuizResult