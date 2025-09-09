"use client"
import { Button } from '@/components/ui/button'
import { Eye, Loader2, PlusIcon, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import useFetch from '../../../../hooks/useFetch'
import { deleteCoverLetterWithId, getAllCoverLetters } from '@/../actions/coverLetter'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarLoader } from 'react-spinners'
import { format } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'


export interface CoverLetterType {
    jobDescription: string;
    companyName: string;
    jobTitle: string;
}

export interface CoverLetterResponseType extends CoverLetterType{
    content: string;
    createdAt: string;
    id: string;
}

const page = () => {
    const [coverLetters, setCoverLetters] = useState<CoverLetterResponseType[]>([])
    const {
        data: lettersData,
        error: lettersFetchError,
        fn: fetchCoverLetters,
        loading: isFetchingLetters
    } = useFetch(getAllCoverLetters)

    useEffect(() => {
        fetchCoverLetters()
    }, [])

    const router = useRouter()

    useEffect(() => {
        if (lettersData && !isFetchingLetters) {
            setCoverLetters(lettersData)
        }
        if (lettersFetchError) {
            setCoverLetters([])
        }
    }, [lettersData, lettersFetchError, isFetchingLetters])

    const {
        data: isDeletedData, 
        error: isDeletedError,
        fn: deleteCoverLetterFn,
        loading: isDeleted
    } = useFetch(deleteCoverLetterWithId)

    useEffect(() => {
        if (isDeletedData && !isDeleted) {
            toast.success("Cover letter deleted successfully");
            fetchCoverLetters();
        }
        if (isDeletedError) {
            toast.error("Error deleting Cover letter");
        }
    }, [isDeletedData, isDeletedError, isDeleted,]);

    const deleteCoverLetter = async (id: string) => {
        try {
            deleteCoverLetterFn(id)
        } catch (error: any) {
            console.error("Error deleting cover letter with id", id, "With error is ", error?.message)
            toast.error("Error deleting Cover letter with id" + id)
        }
    }
  return (
		<div>
			<div className="flex justify-between items-center mb-10">
				<h1 className="gradient-title text-4xl md:text-5xl">
					My Cover Letters
				</h1>
                <Link href={"/cover-letter/create-new"}>
				<Button disabled={isFetchingLetters}>
					<PlusIcon className="w-4 h-4" />
					Create New
				</Button>
                </Link>
			</div>
			{isFetchingLetters && (
				<div>
					<BarLoader className="w-full" color="gray" width={"100%"} />
				</div>
			)}
            <div className='space-y-4'>

			{!isFetchingLetters && coverLetters.map((eachLetter) => {
                return (
					<Card key={eachLetter.id}>
						<CardHeader className="flex items-center justify-between">
							<div>
								<CardTitle>
									<h1>
										{eachLetter.jobTitle.toUpperCase()} at{" "}
										{eachLetter.companyName}
									</h1>
									<p className="mt-2 text-sm text-muted-foreground font-normal italic">
										Created{" "}
										{format(
											eachLetter.createdAt,
											"dd MMMM yyyy"
										)}
									</p>
								</CardTitle>
							</div>
							<div className="space-x-2">
								<Button
									variant={"outline"}
									onClick={() =>
										router.push(
											`/cover-letter/${eachLetter.id}`
										)
									}
								>
									<Eye className="w-4 h-4" />
								</Button>
								<Button
									variant={"outline"}
									onClick={() =>
										deleteCoverLetter(eachLetter.id)
									}
                                    disabled={isDeleted}
								>
									{isDeleted ? (
										<Loader2 className="animate-spin w-4 h-4" />
									) : (
										<Trash2 className="w-4 h-4" />
									)}
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<p>
								{eachLetter.jobDescription
									.charAt(0)
									.toUpperCase() +
									eachLetter.jobDescription.slice(1)}
							</p>
						</CardContent>
					</Card>
				);
			})}
            </div>
		</div>
  );
}

export default page