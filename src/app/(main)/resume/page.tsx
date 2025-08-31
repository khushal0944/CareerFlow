"use client";
import { resumeSchema } from "@/app/lib/resumeSchema";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Download, Edit, Monitor, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useFetch from "@/../hooks/useFetch";
import { saveResume } from "@/../actions/resume";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EntryForm from "./_components/entryForm";

const ResumePage = ({ initialContent }: { initialContent?: string }) => {
	const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
	const [resumeMode, setResumeMode] = useState<"edit" | "preview">("preview");
	const [previewContent, setPreviewContent] = useState<string>(initialContent || "");
	const {
		control,
		handleSubmit,
		register,
		watch,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(resumeSchema),
		defaultValues: {
			contact: {},
			education: [],
			experience: [],
			projects: [],
			skills: "",
			summary: "",
		},
	});

	const submitData = (data: any) => {
		console.log("loading data");
		console.log(data);
	};

	const saveResumeData = useFetch(saveResume);

	useEffect(() => {
		if (initialContent) setActiveTab("preview");
	}, [initialContent]);
	return (
		<div className="mx-auto">
			<div className="flex justify-between items-center">
				<h1 className="gradient-title text-6xl md:text-7xl font-bold mb-5">
					Resume Builder
				</h1>
				<div className="space-x-2">
					<Button variant={"destructive"}>
						<Save className="h-4 w-4" /> Save
					</Button>
					<Button>
						<Download className="h-4 w-4" /> Download pdf
					</Button>
				</div>
			</div>
			<Tabs
				value={activeTab}
				onValueChange={() =>
					activeTab === "edit"
						? setActiveTab("preview")
						: setActiveTab("edit")
				}
			>
				<TabsList>
					<TabsTrigger value="edit">Form</TabsTrigger>
					<TabsTrigger value="preview">Markdown</TabsTrigger>
				</TabsList>
				<TabsContent value="edit">
					<form onSubmit={handleSubmit(submitData)}>
						<div className="mt-4 p-4 bg-muted/50 border rounded-lg space-y-4">
							<div>
								<h3 className="text-lg font-medium">
									Contact Information
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label
											htmlFor="email"
											className="text-sm text-muted-foreground"
										>
											Email
										</label>
										<Input
											id="email"
											{...register("contact.email")}
											type="email"
											placeholder="your-email@gmail.com"
										/>
										{errors.contact?.email && (
											<span className="text-red-500 text-xs">
												{errors.contact.email.message}
											</span>
										)}
									</div>
									<div>
										<label
											htmlFor="phone"
											className="text-sm text-muted-foreground"
										>
											Phone
										</label>
										<Input
											id="phone"
											{...register("contact.mobile")}
											type="text"
											placeholder="9876543210"
										/>
										{errors.contact?.mobile && (
											<span className="text-red-500 text-xs">
												{errors.contact.mobile.message}
											</span>
										)}
									</div>
									<div>
										<label
											htmlFor="linkedin"
											className="text-sm text-muted-foreground"
										>
											Linkedin
										</label>
										<Input
											id="linkedin"
											{...register("contact.linkedinUrl")}
											type="url"
											placeholder="https://linkedin.com/in/your-username"
										/>
										{errors.contact?.linkedinUrl && (
											<span className="text-red-500 text-xs">
												{
													errors.contact.linkedinUrl
														.message
												}
											</span>
										)}
									</div>
									<div>
										<label
											htmlFor="github"
											className="text-sm text-muted-foreground"
										>
											Github
										</label>
										<Input
											id="github"
											{...register("contact.githubUrl")}
											type="url"
											placeholder="https://github.com/your-username"
										/>
										{errors.contact?.githubUrl && (
											<span className="text-red-500 text-xs">
												{
													errors.contact.githubUrl
														.message
												}
											</span>
										)}
									</div>
								</div>
							</div>
							<div>
								<h3 className="text-lg font-medium mb-1">
									Professional Summary
								</h3>
								<Controller
									name="summary"
									control={control}
									render={({ field }) => {
										return (
											<Textarea
												{...field}
												className="h-32"
												placeholder="Write about yourself"
											/>
										);
									}}
								/>
								{errors.summary && (
									<span className="text-red-500 text-xs">
										{errors.summary.message}
									</span>
								)}
							</div>
							<div>
								<h3 className="text-lg font-medium mb-1">
									Skills
								</h3>
								<Controller
									name="skills"
									control={control}
									render={({ field }) => {
										return (
											<Textarea
												{...field}
												className="h-32"
												placeholder="Write your skills seperated by ,"
											/>
										);
									}}
								/>
								{errors.skills && (
									<span className="text-red-500 text-xs">
										{errors.skills.message}
									</span>
								)}
							</div>

							<div>
								<h3 className="text-lg font-medium mb-1">
									Work Experience
								</h3>
								<Controller
									name="experience"
									control={control}
									render={({ field }) => (
										<EntryForm
											type="Experience"
											onChange={field.onChange}
											entries={field.value}
										/>
									)}
								/>
								{errors.experience && (
									<span className="text-red-500 text-xs">
										{errors.experience?.message}
									</span>
								)}
							</div>
							<div>
								<h3 className="text-lg font-medium mb-1">
									Education
								</h3>
								<Controller
									name="education"
									control={control}
									render={({ field }) => (
										<EntryForm
											type="Education"
											onChange={field.onChange}
											entries={field.value}
										/>
									)}
								/>
								{errors.education && (
									<span className="text-red-500 text-xs">
										{errors.education.message}
									</span>
								)}
							</div>
							<div>
								<h3 className="text-lg font-medium">
									Projects
								</h3>
								<Controller
									name="projects"
									control={control}
									render={({ field }) => (
										<EntryForm
											type="Projects"
											onChange={field.onChange}
											entries={field.value}
										/>
									)}
								/>
								{errors.projects && (
									<span className="text-red-500 text-xs">
										{errors.projects.message}
									</span>
								)}
							</div>
							<Button type="submit">Submit</Button>
						</div>
					</form>
				</TabsContent>
				<TabsContent value="preview">
					<Button variant={"link"} type="button" className="mb-2" onClick={() => setResumeMode(resumeMode === "edit" ? "preview" : "edit")}>
                        {
                            resumeMode === "preview" ? (
                                <>
                                <Edit className="h-4 w-4" />
                                Edit Resume
                                </>
                            ) : (
                                <>
                                <Monitor className="w-4 h-4" />
                                Show Preview
                                </>
                            )
                        }
                    </Button>
                    {
                        (resumeMode !== "preview") && <div className="flex items-center border-2 p-3 gap-2 border-yellow-600 text-yellow-600 rounded b-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm">
                                You will lose edited markdown if you update the form data.
                            </span>
                        </div>
                    }

				</TabsContent>
			</Tabs>
		</div>
	);
};

export default ResumePage;
