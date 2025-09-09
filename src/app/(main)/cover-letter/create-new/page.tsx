"use client"
import { coverLetterSchema } from "@/app/lib/coverLetterSchema";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, XIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CoverLetterType } from "../page";
import { generateAICoverLetter } from "../../../../../actions/coverLetter";
import useFetch from "../../../../../hooks/useFetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CreateNew = () => {
	const {
		formState: { errors },
		register,
		handleSubmit,
	} = useForm({
		resolver: zodResolver(coverLetterSchema),
	});
	const {
		data: generatingletterData,
		error: generatingletterError,
		fn: generatingletterFn,
		loading: isGenerating,
	} = useFetch(generateAICoverLetter);

    const router = useRouter();

	useEffect(() => {
		if (generatingletterData && !isGenerating) {
			toast.success("Cover letter generated successfully");
			router.push("/cover-letter");
		}
		if (generatingletterError) {
			toast.error("Cover Letter Generation Failed");
		}
	}, [generatingletterData, generatingletterError, isGenerating, router]);

	const generateCoverLetter = async (data: CoverLetterType) => {
		try {
			generatingletterFn(data);
		} catch (error: any) {
			console.error("Generating cover letter error", error.message);
		}
	};

	return (
		<div className="space-y-4">
			<div>
				<h1 className="gradient-title text-4xl md:text-5xl">
					Create Cover Letter
				</h1>
				<p>Generate a tailored cover letter for your job application</p>
			</div>

			<Card>
				<CardHeader className="flex items-center justify-between">
					<div>
						<CardTitle>Job Details</CardTitle>
						<CardDescription>Provide information</CardDescription>
					</div>
					<div>
						<Button
							onClick={() => router.push("/cover-letter")}
							variant={"outline"}
						>
							<XIcon className="h-4 w-4" />
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<form
						className="space-y-4"
						onSubmit={handleSubmit(generateCoverLetter)}
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
							<div className="space-y-2">
								<Label htmlFor="jobTitle">Job Title</Label>
								<Input
									id="jobTitle"
									placeholder="Enter Job Title"
									{...register("jobTitle")}
								/>
								{errors.jobTitle && (
									<p className="text-xs text-red-500">
										{errors.jobTitle.message}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="companyName">
									Company Name
								</Label>
								<Input
									id="companyName"
									placeholder="Enter company name"
									{...register("companyName")}
								/>
								{errors.companyName && (
									<p className="text-xs text-red-500">
										{errors.companyName.message}
									</p>
								)}
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="jobDescription">
								Job Description
							</Label>
							<Textarea
								className="h-32"
								id="jobDescription"
								placeholder="Enter Job Description"
								{...register("jobDescription")}
							/>
							{errors.jobDescription && (
								<p className="text-xs text-red-500">
									{errors.jobDescription.message}
								</p>
							)}
						</div>
						<div className="flex items-center justify-end">
							<Button type="submit">
                                {isGenerating && <Loader2 className="animate-spin w-4 h-4"/>}
                                Generate Cover Letter
                            </Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default CreateNew;
