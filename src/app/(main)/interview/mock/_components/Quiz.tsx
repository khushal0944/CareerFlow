"use client"

import React, { useEffect, useState } from 'react'
import useFetch from '@/../hooks/useFetch';
import { generateQuiz, saveQuizResult } from '@/../actions/interview';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarLoader } from 'react-spinners';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface eachQuizType {
          question: string;
          options: string[];
          correctAnswer: string;
          explanation: string;
}

const Quiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [showExplaination, setShowExplaination] = useState<boolean>(false);

    const {data: quizData, fn: generateQuizFn, loading: generatingQuiz}: {
        data: eachQuizType[] | null,
        fn: (...args: any[]) => Promise<any>,
        loading: boolean
    } = useFetch(generateQuiz)

    const {
		data: scoreData,
		fn: saveScoreFn,
		loading: savingScore,
        setData: saveQuizData
	}: {
		data: eachQuizType[] | null;
		fn: (...args: any[]) => Promise<any>;
		loading: boolean;
        setData: (...args: any) => any
	} = useFetch(saveQuizResult);

    console.log(scoreData)

    useEffect(() => {
        if (quizData) {
            setAnswers(new Array((quizData as []).length).fill(null))
        }
    }, [quizData])

    const handleAnswer = (answer: any) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answer
        setAnswers(newAnswers)
    }

    const handleNext = () => {
        if (quizData && currentQuestion < (quizData as []).length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setShowExplaination(false)
        } else {
            finishQuiz()
        }
    }

    const calculateScore = () => {
        if (!quizData) return;
        let correct = 0;
        answers.forEach((answer, index) => {
			if (answer === (quizData as any)[index].correctAnswer) {
                correct++;
            }
		});
        return (correct / (quizData as []).length) * 100;
    }

    const finishQuiz = async () => {
        const score = calculateScore();

        try {
            await saveScoreFn(quizData, answers, score);
            toast.success("Quiz completed!")
        } catch (error) {
            console.log("Error Saving quiz data", error)
            toast.error("Error saving quiz score")
        }
    }

    if (generatingQuiz) {
        return <BarLoader className='w-full mx-auto ' width={'80%'} color='gray'/>
    }

    if (!quizData) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Ready to test your knowledge?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-muted-foreground'>
                        This quiz contains 10 questions specific to your industry and skills. Take your time and answer each question to the best of your ability.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button className='w-full' onClick={generateQuizFn}>
                        Start Quiz
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    const question: eachQuizType = quizData[currentQuestion];
  return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>
						Question {currentQuestion + 1} of{" "}
						{(quizData as []).length}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-lg font-medium">{question.question}</p>
					<RadioGroup
						className="space-y-1"
						onValueChange={handleAnswer}
						value={answers[currentQuestion]}
					>
						{question.options.map((option, idx) => (
							<div
								key={idx}
								className="flex items-center space-x-2"
							>
								<RadioGroupItem
									value={option}
									id={`option-${idx}`}
								/>
								<Label htmlFor={`option-${idx}`}>
									{option}
								</Label>
							</div>
						))}
					</RadioGroup>

					{showExplaination && (
						<div className="mt-4 p-4 bg-muted rounded-lg">
							<p className="font-medium">Explaination:</p>
							<p className="text-muted-foreground">
								{question.explanation}
							</p>
						</div>
					)}
				</CardContent>
				<CardFooter>
					{!showExplaination && (
						<Button
							variant={"outline"}
							disabled={!answers[currentQuestion]}
							onClick={() => setShowExplaination(true)}
						>
							Show explaination
						</Button>
					)}

					<Button
						onClick={handleNext}
						className='ml-auto'
						disabled={!answers[currentQuestion] || savingScore}
					>
                        {
                            savingScore && <Loader2 className='h-4 w-4 animate-spin'/>
                        }
                        {
                            currentQuestion < (quizData as []).length - 1 ? "Next Question": "Finish Quiz"
                        }
                    </Button>
				</CardFooter>
			</Card>
		</div>
  );
}

export default Quiz