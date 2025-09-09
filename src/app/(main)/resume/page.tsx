"use client";
import { resumeSchema } from "@/app/lib/resumeSchema";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Download, Edit, Loader2, Monitor, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useFetch from "@/../hooks/useFetch";
import { saveResume } from "@/../actions/resume";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EntryForm from "./_components/entryForm";
import { entriesToMarkdown } from "@/app/helpers/entriesToMarkdown";
import { useUser } from "@clerk/nextjs";
import MDEditor from "@uiw/react-md-editor";
import { toast } from "sonner";
import html2pdf from "html2pdf.js";

const ResumePage = ({ initialContent }: { initialContent?: string }) => {
	const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
	const [resumeMode, setResumeMode] = useState<"edit" | "preview">("preview");
	const [previewContent, setPreviewContent] = useState<string>(initialContent || "");
    const [isGenerating, setIsGenerating] = useState(false)
    const [isSaving, setIsSaving] = useState(false);
    const {user} = useUser();
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

    const formValues = watch()

    const generatePdf = async () => {
        setIsGenerating(true);
        try {
            const elem = document.getElementById("resume-pdf")
            const opt = {
                margin: [15, 15],
                filename: "resume.pdf",
                image: {type: "jpeg", quality: 0.98},
                html2canvas: {scale: 2},
                jsPDF: {unit: "mm", format: "a4", orientation: "portrait"}
            }

            await html2pdf().set(opt).from(elem!).save()
        } catch (error) {
            console.error("Error generating pdf", error)
            toast.error("Error generating pdf")
        }
    }

      const getContactMarkdown = () => {
			const { contact } = formValues;
			const parts = [];
			if (contact.email) parts.push(`📧 ${contact.email}`);
			if (contact.mobile) parts.push(`📱 ${contact.mobile}`);
			if (contact.linkedinUrl)
				parts.push(`💼 [LinkedIn](${contact.linkedinUrl})`);
			if (contact.githubUrl)
				parts.push(`🐦 [Twitter](${contact.githubUrl})`);

			return parts.length > 0
				? `## <div align="center">${user?.fullName}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
				: "";
		};

		const getCombinedContent = () => {
			const { summary, skills, experience, education, projects } =
				formValues;
			return [
				getContactMarkdown(),
				summary && `## Professional Summary\n\n${summary}`,
				skills && `## Skills\n\n${skills}`,
				entriesToMarkdown(experience, "Work Experience"),
				entriesToMarkdown(education, "Education"),
				entriesToMarkdown(projects, "Projects"),
			]
				.filter(Boolean)
				.join("\n\n");
		};

        useEffect(() => {
            if (activeTab === "edit") {
                const newContent = getCombinedContent();
                setPreviewContent((newContent ? newContent : initialContent) || "")
            }
        }, [activeTab, formValues])

	const {data: saveResumeData, fn: saveResumeFn, error: saveResumeError, loading: saveResumeLoading} = useFetch(saveResume);

    useEffect(() => {
        if (saveResumeData && !saveResumeLoading) {
            toast.success("Resume saved successfully")
            return
        }
        if (saveResumeError) {
            toast.error(saveResumeError || "Failed to save resume")
        }
    }, [saveResumeError, saveResumeLoading, saveResumeData])

    	const submitData = async (data: any) => {
			console.log("loading data");
			console.log(data);
			try {
				await saveResumeFn(previewContent);
			} catch (error) {
                console.error("Saving resume failed", error)
            }
		};

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
					<Button variant={"destructive"} onClick={submitData} disabled={isSaving}>
						{isGenerating ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />{" "}
								Saving...
							</>
						) : (
							<>
								<Save className="h-4 w-4" /> Save
							</>
						)}
					</Button>
					<Button onClick={generatePdf} disabled={isGenerating}>
						{isGenerating ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />{" "}
								Downloading
							</>
						) : (
							<>
								<Download className="h-4 w-4" /> Download pdf
							</>
						)}
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
					<form>
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
					<Button
						variant={"link"}
						type="button"
						className="mb-2"
						onClick={() =>
							setResumeMode(
								resumeMode === "edit" ? "preview" : "edit"
							)
						}
					>
						{resumeMode === "preview" ? (
							<>
								<Edit className="h-4 w-4" />
								Edit Resume
							</>
						) : (
							<>
								<Monitor className="w-4 h-4" />
								Show Preview
							</>
						)}
					</Button>
					{resumeMode !== "preview" && (
						<div className="flex items-center border-2 p-3 gap-2 border-yellow-600 text-yellow-600 rounded b-2">
							<AlertTriangle className="h-4 w-4" />
							<span className="text-sm">
								You will lose edited markdown if you update the
								form data.
							</span>
						</div>
					)}

					<div className="rounded border">
						<MDEditor
							value={previewContent}
							onChange={(v) => setPreviewContent(v || "")}
							height={800}
							preview={resumeMode}
						/>
					</div>

					<div className="hidden">
						<div id="resume-pdf">
							<MDEditor.Markdown
								source={previewContent}
								style={{
									background: "white",
									color: "black",
								}}
							/>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default ResumePage;
