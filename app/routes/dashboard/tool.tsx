import { and, desc, eq } from "drizzle-orm";
import {
	ArrowLeft,
	BookOpen,
	Calendar,
	ChevronRight,
	Delete,
	X,
} from "lucide-react";
import { Link, redirect, useFetcher } from "react-router";
import { validate as isValidUUID } from "uuid";
import DynamicToolCard from "~/components/generations/tool-card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { db } from "~/db/index.server";
import {
	generationsTable,
	toolsTable,
	type Generation,
	type Tool,
} from "~/db/schema";
import { cn, formatDate } from "~/lib/utils";
import { GenerationsSchemas } from "~/lib/zod/generations/schemas";
import { type StoryResponse } from "~/lib/zod/generations/simplify-bible-story";
import type { VerseResponse } from "~/lib/zod/generations/simplify-bible-verse";
import { createSupabaseServerClient } from "~/server";
import type { Route } from "./+types/tool";
import React from "react";

type FetcherResponse = {
	success: boolean;
	message: string;
};

export async function loader({ request, params }: Route.LoaderArgs) {
	const { client } = createSupabaseServerClient(request);
	const { auth } = client;
	const { data: supabase } = await auth.getUser();
	if (!supabase.user?.id) throw redirect("/sign-up");
	const { id } = params;
	// check if its uuid save db operaitons
	if (!isValidUUID(id)) throw redirect("/dashboard/tools");
	const [tool] = await db
		.select()
		.from(toolsTable)
		.where(eq(toolsTable.id, id))
		.limit(1);
	if (!tool) throw redirect("/dashboard/tools");
	const generations = await db
		.select()
		.from(generationsTable)
		.where(
			and(
				eq(generationsTable.toolId, id),
				eq(generationsTable.userId, supabase.user.id)
			)
		)
		.orderBy(desc(generationsTable.createdAt));
	return {
		generations,
		tool,
	};
}

export default function Page({ loaderData }: Route.ComponentProps) {
	const { generations, tool } = loaderData;
	const isThereGenerations = generations.length > 0;
	return (
		<>
			<BaseComp tool={tool} />
			{isThereGenerations && (
				<GenerationsList generations={generations} tool={tool} />
			)}
			{!isThereGenerations && <NoGenerationsFound tool={tool} />}
		</>
	);
}
// Base Components across all generations
function BaseComp({ tool }: { tool: Tool }) {
	return (
		<div className="py-8">
			<div className="border-8 border-amber-800/20 rounded-lg bg-amber-50 p-6 md:p-8 shadow-md mb-8">
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-3xl font-serif font-bold text-amber-900">
						{tool.name} Generations
					</h1>
					<Link
						to="/dashboard/generations"
						className="flex items-center gap-2 text-amber-800 hover:text-amber-900 transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						<span>Back to Tools</span>
					</Link>
				</div>
				<p className="text-amber-700">
					View your previously generated content and insights.
				</p>
			</div>
		</div>
	);
}
function DeleteGeneration({
	generationId,
	className,
}: {
	generationId: string;
	className?: string;
}) {
	const fetcher = useFetcher<FetcherResponse>();
	const isPending = fetcher.state !== "idle";
	return (
		<fetcher.Form
			action="/resource/generations"
			method="DELETE"
			className="self-end justify-end"
			onSubmit={(e) => {
				e.preventDefault();
				fetcher.submit(
					{
						generationId,
						intent: "delete-generation",
					},
					{
						action: "/resource/generations",
						method: "DELETE",
					}
				);
			}}
		>
			<Button
				type="submit"
				variant={"ghost"}
				disabled={isPending}
				className={cn(``, className)}
			>
				<X className="w-4 h-4 text-red-400" />
			</Button>
		</fetcher.Form>
	);
}
// Lists
function GenerationsList({
	generations,
	tool,
}: {
	generations: Generation[];
	tool: Tool;
}) {
	const { intent } = tool;
	const renderComponent = () => {
		switch (intent) {
			case "simplify-bible-story":
				return <StoryGenerationsList generations={generations} tool={tool} />;
			case "simplify-bible-verse":
				return (
					<SimplifiedVerseGenerationsList
						generations={generations}
						tool={tool}
					/>
				);

			default:
				return null;
		}
	};
	return (
		<div className="space-y-4">
			{/* Delete Button (shared) */}
			{/* Generation Data */}
			{renderComponent()}
		</div>
	);
}

function StoryGenerationsList({
	generations,
	tool,
}: {
	generations: Generation[];
	tool: Tool;
}) {
	// for types
	const generationsData = generations.map((generation) => ({
		...generation,
		data: generation.data as StoryResponse,
	}));
	return (
		<>
			{generationsData.map((generation) => (
				<div key={generation.id}>
					<DeleteGeneration generationId={generation.id} />
					<Link
						key={generation.id}
						to={`/dashboard/generations/${tool.intent}/${generation.id}`}
						className="block border-4 border-amber-800/20 rounded-lg bg-amber-50 p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:border-amber-800/40"
					>
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<div className="flex-1">
								<h2 className="text-xl font-serif font-bold text-amber-900 mb-2">
									{generation.data.summary}
								</h2>

								{generation.data.summary && (
									<p className="text-amber-700 line-clamp-2">
										{generation.data.summary}
									</p>
								)}
							</div>
							<div className="flex items-center gap-4">
								<div className="flex items-center text-amber-700 text-sm">
									<Calendar className="w-4 h-4 mr-1" />
									<span>{formatDate(generation.createdAt)}</span>
								</div>
								<ChevronRight className="w-5 h-5 text-amber-800" />
							</div>
						</div>
					</Link>
				</div>
			))}
		</>
	);
}

function SimplifiedVerseGenerationsList({
	generations,
	tool,
}: {
	generations: Generation[];
	tool: Tool;
}) {
	const generationsData = generations.map((generation) => ({
		...generation,
		data: generation.data as VerseResponse,
	}));
	return (
		<>
			{generationsData.map((generation) => (
				<div className="flex flex-col gap-1" key={generation.id}>
					<DeleteGeneration generationId={generation.id} />
					<Link
						to={`/dashboard/generations/${tool.intent}/${generation.id}`}
						className="block border-4 border-amber-800/20 rounded-lg bg-amber-50 p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:border-amber-800/40"
					>
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<div className="flex flex-col gap-4  max-w-2xl">
								<h2 className="text-xl font-serif font-bold text-amber-900 mb-2">
									{generation.data.bibleVerses[0].bibleVerse ||
										"Untitled Generation"}
								</h2>
								<p className="text-amber-700 line-clamp-2">
									{generation.data.bibleVerses[0].reference}
								</p>
								<div className="flex flex-row items-center w-full  gap-2">
									helped with:
									<div className="flex items-center flex-row gap-4 w-full flex-wrap">
										{generation.data.feelings.map((feeling) => (
											<Badge variant={"outline"}>{feeling}</Badge>
										))}
									</div>
								</div>
							</div>

							<div className="flex items-center gap-4">
								<div className="flex items-center text-amber-700 text-sm">
									<Calendar className="w-4 h-4 mr-1" />
									<span>{formatDate(generation.createdAt)}</span>
								</div>
								<ChevronRight className="w-5 h-5 text-amber-800" />
							</div>
						</div>
					</Link>
				</div>
			))}
		</>
	);
}

function NoGenerationsFound({ tool }: { tool: Tool }) {
	const zodRequestSchema =
		GenerationsSchemas[tool.intent as keyof typeof GenerationsSchemas];
	return (
		<div className="border-4 flex items-center justify-center flex-col border-amber-800/20 rounded-lg bg-amber-50 p-8 text-center">
			<BookOpen className="w-12 h-12 text-amber-700/50 mx-auto mb-4" />
			<h2 className="text-xl font-serif font-bold text-amber-900 mb-2">
				No Generations Yet
			</h2>
			<p className="text-amber-700 mb-6">
				You haven't created any content with this tool yet.
			</p>
			<DynamicToolCard
				key={tool.id}
				title={tool.name}
				description={tool.description}
				dialogDescription={tool.description}
				dialogTitle={tool.name}
				intent={tool.intent}
				schema={zodRequestSchema}
				toolId={tool.id}
				toolCost={tool.cost}
				toolSlug={tool.intent}
			/>
		</div>
	);
}
