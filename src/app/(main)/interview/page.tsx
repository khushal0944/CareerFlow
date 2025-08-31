import React from 'react'
import { getAssessments } from '@/../actions/interview'
import StatCards from './mock/_components/StatCards';
import PerformanceChart from './mock/_components/PerformanceChart';
import QuizList from './mock/_components/QuizList';

interface QuizQuestion {
	answer: string;
	question: string;
	isCorrect: boolean;
	userAnswer: string;
	explanation: string;
}

export interface AssessmentType {
	id: string;
	userId: string;
	quizScore: number;
	category: string;
	improvementTip?: string | null;
	createdAt: Date;
	updatedAt: Date;
    questions: QuizQuestion[] | any;
}

const page = async () => {
    const assessments: AssessmentType[] = await getAssessments();
  return (
    <div className='mx-5'>
            <h1 className='gradient-title text-6xl font-bold mb-5'>
                Interview Preperation
            </h1>

        <div className='space-y-4'>
            <StatCards assessment={assessments}/>
            <PerformanceChart assessment={assessments}/>
            <QuizList assessments={assessments}/>
        </div>
    </div>
  )
}

export default page