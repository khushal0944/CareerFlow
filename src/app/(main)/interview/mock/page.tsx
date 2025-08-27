import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Quiz from './_components/Quiz'

const page = () => {
  return (
		<div className='space-y-4'>
			<div className='flex flex-col space-y-1'>
				<Link href={"/interview"}>
					<Button variant={"link"} className="pl-0 gap-2">
                        <ArrowLeft className='h-4 w-4'/>
						<span>Back to Interview Preparation</span>
					</Button>
				</Link>
            <h1 className='gradient-title text-6xl font-bold'>
                Mock Interview
            </h1>
            <p className='text-muted-foreground'>Test your knowledge with industry-specific questions.</p>
			</div>
            <Quiz />
		</div>
  );
}

export default page