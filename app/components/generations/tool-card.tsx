import { ArrowRight, BookOpen, Loader2, Quote, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useFetcher } from "react-router";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { formatZodDefaultValues } from "~/lib/zod/zod-utils";
import { useDashboardLoaderData } from "~/routes/dashboard/layout";
import { useUpgradeModal } from "../globals/upgrade-modal";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { getToolIcon } from "./tool-icon";

interface ToolCardProps {
	title: string;
	description: string;
	schema: z.ZodObject<any>; // Accept any Zod schema
	dialogTitle: string;
	dialogDescription: string;
	intent: string; // For the form submission
	toolId: string;
	toolCost: number;
	toolSlug: string;
}

interface FetcherResponse {
	success: boolean;
	message: string;
	errors: string;
}

export default function DynamicToolCard({
	title,
	description,
	schema,
	dialogTitle,
	dialogDescription,
	intent,
	toolId,
	toolCost,
	toolSlug,
}: ToolCardProps) {
	const [open, setOpen] = useState(false);
	const { showUpgradeModal } = useUpgradeModal();
	const customFetcher = useFetcher<FetcherResponse>();
	const isPending = customFetcher.state !== "idle";
	const defaultValues = formatZodDefaultValues(schema);
	const form = useForm({
		resolver: zodResolver(schema),
		mode: "onSubmit",
		defaultValues,
	});
	const {
		user: { tokens },
	} = useDashboardLoaderData();
	const potentionalNewTokenValue = tokens - toolCost;
	const balanceIsNotEnough = tokens === 0 || potentionalNewTokenValue < 0;

	useEffect(() => {
		if (customFetcher.data) {
			if (!customFetcher.data?.success) {
				toast.error(customFetcher.data.message);
			}
			if (customFetcher.data.success) {
				toast.success(customFetcher.data.message);
			}
		}
	}, [customFetcher.data]);

	useEffect(() => {
		if (customFetcher.state === "submitting") {
			if (!customFetcher.formData) return;
			const fetcherData = Object.fromEntries(customFetcher.formData.entries());
			toast.promise(handleSubmit(fetcherData), {
				loading: "Generation In Progress",
				error: "Something went wrong",
			});
		}
	}, [customFetcher.state]);

	// Function to render form fields based on schema
	const renderFormFields = () => {
		// Get schema shape
		const shape = schema._def.shape();

		return Object.entries(shape).map(([fieldName, fieldSchema]) => {
			// Determine field type based on schema

			/* @ts-ignore */
			const isEnum = fieldSchema._def.typeName === "ZodEnum";

			/* @ts-ignore */
			const isOptional = fieldSchema.isOptional?.();

			// Render appropriate form field based on schema type
			return (
				<div className="grid gap-2" key={fieldName}>
					<FormField
						control={form.control}
						disabled={isPending}
						name={fieldName}
						render={({ field }) => (
							<FormItem>
								<FormLabel
									htmlFor={fieldName}
									className="font-serif text-amber-900"
								>
									{formatFieldName(fieldName)}
								</FormLabel>
								<FormControl>
									{isEnum ? (
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
											disabled={isPending}
										>
											<SelectTrigger className="flex w-full justify-between border-amber-800/30 focus:border-amber-800 focus:ring-amber-800 bg-amber-50 text-amber-900">
												<SelectValue
													placeholder={`Select ${formatFieldName(
														fieldName
													).toLowerCase()}`}
												/>
											</SelectTrigger>
											<SelectContent className="bg-amber-50 border-amber-800/30">
												<SelectGroup>
													{/* @ts-ignore */}
													{fieldSchema._def.values.map((value: string) => (
														<SelectItem
															key={value}
															value={value}
															className="text-amber-900 hover:bg-amber-100"
														>
															{formatFieldName(value)}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									) : fieldName.toLowerCase().includes("reference") ||
									  fieldName.toLowerCase().includes("description") ? (
										<Textarea
											id={fieldName}
											placeholder={`Enter ${formatFieldName(
												fieldName
											).toLowerCase()}`}
											className="min-h-[100px] border-amber-800/30 focus:border-amber-800 focus:ring-amber-800 bg-amber-50 text-amber-900"
											{...field}
										/>
									) : (
										<Input
											id={fieldName}
											placeholder={`Enter ${formatFieldName(
												fieldName
											).toLowerCase()}`}
											className="border-amber-800/30 focus:border-amber-800 focus:ring-amber-800 bg-amber-50 text-amber-900"
											{...field}
										/>
									)}
								</FormControl>
								<FormMessage className="text-red-600" />
							</FormItem>
						)}
					/>
				</div>
			);
		});
	};

	// Helper function to format field names for display
	const formatFieldName = (name: string) => {
		return name
			.replace(/([A-Z])/g, " $1") // Insert space before capital letters
			.replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
			.trim();
	};

	const handleSubmit = (data: any) => {
		return customFetcher.submit(
			{
				...data,
				intent,
				toolId,
				toolSlug,
			},
			{
				action: "/resource/generations",
				method: "POST",
			}
		);
	};

	return (
		<Card
			className={cn(
				"w-full max-w-md border-4 border-amber-800/20 bg-amber-50 shadow-md hover:shadow-lg transition-all duration-300",
				isPending ? "opacity-70" : ""
			)}
		>
			<CardHeader className="pb-2">
				<div className="flex items-center gap-3">
					<div className="bg-amber-100 p-3 rounded-lg border border-amber-800/20">
						{getToolIcon(intent)}
					</div>
					<CardTitle className="text-xl font-serif font-bold text-amber-900">
						{title}
					</CardTitle>
				</div>
			</CardHeader>

			<CardContent>
				<p className="text-amber-700 text-sm">{description}</p>
			</CardContent>

			<CardFooter className="pt-2">
				<Dialog open={open} onOpenChange={setOpen}>
					<div className="flex justify-start w-full flex-col gap-4">
						<DialogTrigger asChild>
							<Button
								onClick={(e) => {
									e.preventDefault();
									if (balanceIsNotEnough) {
										showUpgradeModal();
									} else {
										setOpen(true);
									}
								}}
								className="w-full cursor-pointer bg-amber-800 hover:bg-amber-900 text-amber-50"
							>
								Generate
							</Button>
						</DialogTrigger>
						<Button
							variant="outline"
							className="border-amber-800 text-amber-800 hover:bg-amber-100"
							asChild
						>
							<Link to={`/dashboard/tools/${toolId}`}>
								See Generated Stories
								<ArrowRight className="size-4 ml-2" />
							</Link>
						</Button>
					</div>
					<DialogContent className="border-4 border-amber-800/20 bg-amber-50 sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle className="text-xl font-serif font-bold text-amber-900">
								{dialogTitle}
							</DialogTitle>
							<DialogDescription className="text-amber-700">
								{dialogDescription}
							</DialogDescription>
						</DialogHeader>
						<Form {...form}>
							<customFetcher.Form
								action="/resource/generations"
								method="POST"
								onSubmit={form.handleSubmit(handleSubmit)}
							>
								<div className="grid gap-4 py-4">{renderFormFields()}</div>
								<DialogFooter>
									<Button
										type="submit"
										className="bg-amber-800 hover:bg-amber-900 text-amber-50"
										disabled={isPending}
									>
										{isPending ? `Generating...` : `Generate`}
									</Button>
								</DialogFooter>
							</customFetcher.Form>
						</Form>
					</DialogContent>
				</Dialog>
			</CardFooter>
		</Card>
	);
}
