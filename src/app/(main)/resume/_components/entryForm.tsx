"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { entrySchema } from "@/app/lib/resumeSchema";
import { Button } from "@/components/ui/button";
import {
	Loader2,
	PlusCircle,
	PlusIcon,
	SparklesIcon,
	XIcon,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { improveWithAi } from "../../../../../actions/resume";
import useFetch from "../../../../../hooks/useFetch";
import { toast } from "sonner";
import { format, parse } from "date-fns";

const formatDate = (dateStr: string) => {
	if (!dateStr) return "";
	const date = parse(dateStr, "yyyy-MM", new Date());
	return format(date, "MMM yyyy");
};

const EntryForm = ({
	type,
	entries,
	onChange,
}: {
	type: string;
	entries: any;
	onChange: (...event: any[]) => void;
}) => {
	const [addFields, setAddFields] = useState(false);

	const {
		handleSubmit,
		register,
		watch,
		setValue,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(entrySchema),
		defaultValues: {
			title: "",
			startDate: "",
			description: "",
			company: "",
			currentExp: false,
			endDate: "",
		},
	});

	const {
		data: improveWithAiData,
		fn: improveWithAiFn,
		loading: improveWithAiLoading,
		error: improveWithAiError,
	} = useFetch(improveWithAi);

	const current = watch("currentExp");

	const handleDelete = (index: number) => {
		const newEntries = entries.filter((_: any, idx: number) => index !== idx);
        console.log(newEntries)
        onChange(newEntries)
	};
	const handleAdd = handleSubmit((data) => {
        if (!data.currentExp && data.startDate > data.endDate!) {
            toast.error("start date must be less than end date");
            return;
        }
        console.log(data.startDate)
        console.log(data.endDate)
		const formattedData = {
			...data,
			startDate: formatDate(data.startDate),
			endDate: data.currentExp ? "" : formatDate(data.endDate!),
		};
		console.log("formatted Data", formattedData);
		onChange([...entries, formattedData]);
		reset();
		setAddFields(false);
	});

    useEffect(() => {
        console.log(entries)
    }, [])

	useEffect(() => {
		if (improveWithAiData && !improveWithAiLoading) {
			console.log(improveWithAiData);
			setValue("description", improveWithAiData);
			toast.success("Improved with ai successfully");
		}

		if (improveWithAiError) {
			toast.error(improveWithAiError || "Failed to improve description");
		}
	}, [improveWithAiData, improveWithAiError, improveWithAiLoading, setValue]);

	const handleImproveWithAI = async () => {
		const description = watch("description");
		const organization = watch("company");
		if (!description) {
			toast.error("Description can't be empty");
			return;
		}

		await improveWithAiFn({
			content: {
				description,
				...(organization && { organization }),
			},
			type: type.toLowerCase(),
		});
	};
	return (
		<div className="space-y-4">
			<div className="space-y-4">
				{
					entries.map((item: any, index: number) => {
						if (index == 1) console.log(entries);
						return (
							<Card key={index}>
								<CardHeader className="flex items-center justify-between">
									<CardTitle className="text-lg font-medium">
										{item.title} @ {item.company}
									</CardTitle>
									<Button
										variant={"outline"}
										size={"icon"}
										onClick={() => handleDelete(index)}
										type="button"
									>
										<XIcon className="h-4 w-4" />
									</Button>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">
										{item.currentExp
											? `${item.startDate} - Present`
											: `${item.startDate} - ${item.endDate}`}
									</p>
									<p className="mt-2 text-sm whitespace-pre-wrap">
										{item.description}
									</p>
								</CardContent>
							</Card>
						);
					})
				}
			</div>
			{addFields && (
				<div>
					<Card>
						<CardHeader>
							<CardTitle>Add {type}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Input
										{...register("title")}
										placeholder="Title/Position"
									/>
									{errors.title && (
										<p className="text-red-500 text-sm">
											{errors.title?.message}
										</p>
									)}
								</div>
								<div className="space-y-2">
									<Input
										{...register("company")}
										placeholder="Organization"
									/>
									{errors.company && (
										<p className="text-red-500 text-sm">
											{errors.company?.message}
										</p>
									)}
								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Input
										{...register("startDate")}
										type="month"
										placeholder="Start Date"
									/>
									{errors.startDate && (
										<p className="text-red-500 text-sm">
											{errors.startDate?.message}
										</p>
									)}
								</div>
								<div className="space-y-2">
									<Input
										{...register("endDate")}
										type="month"
										placeholder="End Date"
										disabled={current}
									/>
									{errors.endDate && (
										<p className="text-red-500 text-sm">
											{errors.endDate?.message}
										</p>
									)}
								</div>
							</div>
							<div className="flex items-center space-x-2">
								<input
									{...register("currentExp")}
									id="current"
									type="checkbox"
									onChange={(e) => {
										setValue(
											"currentExp",
											e.target.checked
										);
										if (e.target.checked) {
											setValue("endDate", "");
										}
									}}
								/>
								<label htmlFor="current">Current {type}</label>
								{errors.endDate && (
									<p className="text-red-500 text-sm">
										{errors.endDate?.message}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<Textarea
									{...register("description")}
									placeholder={`Desciption of your ${type.toLowerCase()}`}
									className="h-32"
								/>
								{errors.company && (
									<p className="text-red-500 text-sm">
										{errors.company?.message}
									</p>
								)}
							</div>
							<Button
								onClick={handleImproveWithAI}
								type="button"
								variant={"ghost"}
								size={"sm"}
								disabled={
									improveWithAiLoading ||
									!watch("description")
								}
							>
								{improveWithAiLoading ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										Improving...
									</>
								) : (
									<>
										<SparklesIcon className="h-4 w-4" />
										Improve with AI
									</>
								)}
							</Button>
						</CardContent>
						<CardFooter className="gap-4">
							<Button
								type="button"
								onClick={() => {
									handleAdd();
								}}
							>
								<PlusCircle className="h-4 w-4 mr-2" />
								Add Entry
							</Button>
							<Button
								type="button"
								variant={"outline"}
								onClick={() => {
									reset();
									setAddFields(false);
								}}
							>
								Cancel
							</Button>
						</CardFooter>
					</Card>
				</div>
			)}
			{!addFields && (
				<Button
					className="w-full"
					variant={"outline"}
					onClick={() => setAddFields(true)}
				>
					<PlusIcon className="h-4 w-4 mr-2" />
					Add {type}
				</Button>
			)}
		</div>
	);
};

export default EntryForm;
