"use client";
import React, { useEffect, useState } from 'react'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import {onBoardingSchema} from '@/app/lib/onBoardingSchema'
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import useFetch from '@/../hooks/useFetch';
import { updateUser } from '@/../actions/user';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
interface industriesType {
    id: string;
    name: string;
    subIndustries: string[]
}

interface onBoardingType {
    industry: string;
    subindustry: string;
    bio?: string;
    experience: number;
    skills?: string[];
}

const OnboardingForm = ({industries}: {industries: industriesType[]}) => {
    const [selectedIndustry, setSelectedIndustry] = useState<industriesType | null>(null);
    const router = useRouter()
    const {register, handleSubmit, setValue, watch, formState: {errors}} = useForm({
        resolver: zodResolver(onBoardingSchema)
    })
    const { data: updateResult, loading: updateLoading, fn: updateUserFn }: any = useFetch(updateUser)
    const onSubmitHandler = async (values: onBoardingType) => {
		try {
			const formattedIndustry = `${values.industry}-${values.subindustry.toLowerCase().replace(/ /g, '-')}`;
            await updateUserFn({
                ...values,
                industry: formattedIndustry
            })
		} catch (error) {
            console.error("Onboarding Error: ", error)
        }
	};

    useEffect(() => {
        if ((updateResult?.success) && !updateLoading) {
            toast.success("Profile updated Successfully!")
            router.push("/dashboard");
            router.refresh()
        }
    }, [updateResult, updateLoading])
    const watchIndustry = watch("industry")
  return (
		<div className="flex justify-center items-center bg-background">
			<Card className="w-full max-w-lg mt-10 mx-2">
				<CardHeader>
					<CardTitle className="gradient-title text-4xl">
						Complete your profile
					</CardTitle>
					<CardDescription>
						Select industry to get personalized career insights and
						recommendations.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						className="space-y-3"
						onSubmit={handleSubmit(onSubmitHandler)}
					>
						<div>
							<Label htmlFor="industry" className="text-lg mb-2">
								Industry
							</Label>
							<Select
								onValueChange={(val) => {
									setValue("industry", val);
									setSelectedIndustry(
										industries.find(
											(ind) => ind.id === val
										) || null
									);
									setValue("subindustry", "");
								}}
							>
								<SelectTrigger className="w-full" id="industry">
									<SelectValue placeholder="Select an Industry" />
								</SelectTrigger>
								<SelectContent>
									{industries.map((each) => {
										return (
											<SelectItem
												key={each.id}
												value={each.id}
											>
												{each.name}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
							{errors.industry && (
								<p className="text-red-500 text-sm">
									{errors.industry.message}
								</p>
							)}
						</div>
						{watchIndustry && (
							<div>
								<Label
									htmlFor="subindustry"
									className="text-lg mb-2"
								>
									Specialization
								</Label>
								<Select
									onValueChange={(val) => {
										setValue("subindustry", val);
									}}
								>
									<SelectTrigger
										className="w-full"
										id="subindustry"
									>
										<SelectValue placeholder="Select a Specialization" />
									</SelectTrigger>
									<SelectContent>
										{selectedIndustry?.subIndustries.map(
											(each) => {
												return (
													<SelectItem
														key={each}
														value={each}
													>
														{each}
													</SelectItem>
												);
											}
										)}
									</SelectContent>
								</Select>
								{errors.subindustry && (
									<p className="text-red-500 text-sm">
										{errors.subindustry.message}
									</p>
								)}
							</div>
						)}

						<div>
							<Label
								htmlFor="experience"
								className="text-lg mb-2"
							>
								Years of Experience
							</Label>
							<Input
								id="experience"
								placeholder="Enter Years of Experience"
								type="number"
								min={0}
								max={50}
								{...register("experience")}
							/>
							{errors.experience && (
								<p className="text-red-500 text-sm">
									{errors.experience.message}
								</p>
							)}
						</div>
						<div>
							<Label htmlFor="skills" className="text-lg mb-2">
								Skills
							</Label>
							<Input
								id="skills"
								placeholder="e.g., Python, C, C++, Java"
								{...register("skills")}
							/>
							<p className="text-sm text-muted-foreground">
								Seperate multiple skills with commas
							</p>
							{errors.skills && (
								<p className="text-red-500 text-sm">
									{errors.skills.message}
								</p>
							)}
						</div>
						<div>
							<Label htmlFor="bio" className="text-lg mb-2">
								Professional Bio
							</Label>
							<Textarea
								id="bio"
								placeholder="Enter your Professional Bio"
								{...register("bio")}
							/>
							{errors.bio && (
								<p className="text-red-500 text-sm">
									{errors.bio.message}
								</p>
							)}
						</div>

						<Button
							className="w-full mt-4"
							type="submit"
							disabled={updateLoading || updateResult}
						>
							{updateLoading ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
									Saving...
								</>
							) : (
								"Complete Profile"
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
  );
}

export default OnboardingForm