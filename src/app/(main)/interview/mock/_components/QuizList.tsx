"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { AssessmentType } from '../../page';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QuizResult from './QuizResult';

const QuizList = ({ assessments }: {assessments: AssessmentType[]}) => {
    const router = useRouter()
    const [selectedQuiz, setSelectedQuiz] = useState<AssessmentType | null>(null);
	return (
		<>
			<Card>
				<CardHeader className="flex items-center justify-between">
					<div>
						<CardTitle className="gradient-title text-3xl md:text-4xl">
							Recent Quizzes
						</CardTitle>
						<CardDescription>
							Review your past quiz performance
						</CardDescription>
					</div>
					<div>
						<Button onClick={() => router.push("/interview/mock")}>
							Start new quiz
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{assessments.map((assessment, i) => {
						return (
							<Card
								className="bg-background cursor-pointer hover:scale-[1.02] hover:border hover:border-white transition"
								key={assessment.id || i}
								onClick={() => setSelectedQuiz(assessment)}
							>
								<CardHeader className="flex justify-between items-center">
									<div>
										<CardTitle>Quiz {i + 1}</CardTitle>
										<CardDescription>
											Score: {assessment.quizScore.toFixed(1)}%
										</CardDescription>
									</div>
									<div>
										{format(
											new Date(assessment.createdAt),
											"MMMM dd, yyyy hh:mm"
										)}
									</div>
								</CardHeader>
								<CardContent>
									{assessment.improvementTip && (
										<div className="text-sm text-muted-foreground">
											{assessment.improvementTip}
										</div>
									)}
								</CardContent>
							</Card>
						);
					})}
				</CardContent>
			</Card>

			<Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
				<DialogContent className='max-w-[80vw] h-[90vh]'>
					<DialogHeader>
						<DialogTitle>
                        </DialogTitle>
					</DialogHeader>
                            {selectedQuiz && <QuizResult className="overflow-scroll" result={selectedQuiz} hideStartNew={true} />}
				</DialogContent>
			</Dialog>
		</>
	);
};

export default QuizList