import { and, eq } from "drizzle-orm";
import {
	ArrowLeft,
	Book,
	Cross,
	Heart,
	HelpCircle,
	Image,
	Lightbulb,
	Scroll,
	Users,
} from "lucide-react";
import { useState } from "react";
import { redirect, useNavigate } from "react-router";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { db } from "~/db/index.server";
import { generationsTable, type Generation } from "~/db/schema";
import type { StoryResponse } from "~/lib/zod/generations/simplify-bible-story";
import type { VerseResponse } from "~/lib/zod/generations/simplify-bible-verse";
import { createSupabaseServerClient } from "~/server";
import type { Route } from "./+types/generation";
type SlugToType = {
	"simplify-bible-story": StoryResponse;
	"simplify-bible-verse": VerseResponse;
};
type Slug = keyof SlugToType;

export async function loader({ request, params }: Route.LoaderArgs) {
	const { client } = createSupabaseServerClient(request);
	const { auth } = client;
	const { data: supabase } = await auth.getUser();
	if (!supabase.user?.id) throw redirect("/sign-up");
	const { generationId, toolSlug: slug } = params;
	const toolSlugToType = slug as Slug;
	const [generation] = (await db
		.select()
		.from(generationsTable)
		.where(
			and(
				eq(generationsTable.id, generationId),
				eq(generationsTable.userId, supabase.user.id)
			)
		)
		.limit(1)) as [Generation];
	if (!generation) {
		console.error("Generation not found");
		throw redirect("/dashboard/generations");
	}
	const typedData = generation.data as SlugToType[typeof toolSlugToType];
	return {
		data: {
			...generation,
			data: typedData,
		},
		slug,
	};
}
export default function GenerationPage({ loaderData }: Route.ComponentProps) {
	const { data, slug } = loaderData;
	const renderComponent = () => {
		switch (slug) {
			case "simplify-bible-story":
				return <SimplifiedStoryComp story={data} />;
			case "simplify-bible-verse":
				return <SimplifedVerseComp verseData={data} />;
			default:
				return null;
		}
	};
	return <Main>{renderComponent()}</Main>;
}
function Main({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate();
	return (
		<div className="md:max-w-4xl mx-auto my-8 md:px-4">
			<Button
				variant={"ghost"}
				onClick={() => navigate(-1)}
				className="flex flex-row items-center gap-2 mb-4"
			>
				<ArrowLeft className="w-4 h-4" />
				<span>Go Back</span>
			</Button>
			{children}
		</div>
	);
}

export function SimplifiedStoryComp({
	story,
}: {
	story: {
		data: StoryResponse;
		id: string;
		userId: string | null;
		toolId: string | null;
		createdAt: Date;
		updatedAt: Date;
	};
}) {
	const [activeTab, setActiveTab] = useState("story");

	return (
		<div className="relative p-8">
			<div className=" bg-amber-50 rounded-lg">
				{/* Inner decorative border */}
				<div className="absolute inset-4 border-2 border-amber-800/30 rounded-lg pointer-events-none" />

				{/* Outer decorative border */}
				<div className="absolute inset-2 border-2 border-amber-800/20 rounded-lg pointer-events-none" />

				{/* Content container */}
				<div className="relative z-10 w-full">
					{/* Title and summary section */}
					<div className="text-center mb-8">
						<h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-4">
							{story.data.title}
						</h1>
						<div className="w-24 h-1 bg-amber-700 mx-auto mb-4"></div>
						<p className="text-amber-800 italic font-serif max-w-2xl mx-auto">
							{story.data.summary}
						</p>

						{story.data.originalReferences &&
							story.data.originalReferences.length > 0 && (
								<div className="mt-3 text-sm text-amber-700 font-medium">
									{story.data.originalReferences.join(" • ")}
								</div>
							)}
					</div>

					{/* Main content tabs */}
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="w-full h-full"
						defaultValue="story"
					>
						<TabsList
							defaultValue={"story"}
							className="flex flex-row flex-wrap md:flex-nowrap h-full gap-4 w-full bg-amber-100 border border-amber-200"
						>
							<TabsTrigger value="story" className="flex items-center gap-1.5">
								<Book className="h-4 w-4" />
								<span className="hidden md:inline">Story</span>
							</TabsTrigger>
							<TabsTrigger
								value="characters"
								className="flex items-center gap-1.5"
							>
								<Users className="h-4 w-4" />
								<span className="hidden md:inline">Characters</span>
							</TabsTrigger>
							<TabsTrigger
								value="lessons"
								className="flex items-center gap-1.5"
							>
								<Lightbulb className="h-4 w-4" />
								<span className="hidden md:inline">Lessons</span>
							</TabsTrigger>
							{story.data.visualDescriptions && (
								<TabsTrigger
									value="visuals"
									className="flex items-center gap-1.5"
								>
									<Image className="h-4 w-4" />
									<span className="hidden md:inline">Visuals</span>
								</TabsTrigger>
							)}
							{story.data.comprehensionQuestions && (
								<TabsTrigger
									value="questions"
									className="flex items-center gap-1.5"
								>
									<HelpCircle className="h-4 w-4" />
									<span className="hidden md:inline">Questions</span>
								</TabsTrigger>
							)}
							{story.data.prayers.length > 0 && (
								<TabsTrigger
									value="prayer"
									className="flex items-center gap-1.5"
								>
									<Cross className="h-4 w-4" />
									<span className="hidden md:inline">Prayer</span>
								</TabsTrigger>
							)}
							<TabsTrigger value="all" className="flex items-center gap-1.5">
								<Scroll className="h-4 w-4" />
								<span className="hidden md:inline">All</span>
							</TabsTrigger>
						</TabsList>

						{/* story.data content */}
						<TabsContent value="story" className="mt-6">
							<Card className="bg-white/80 border-amber-200">
								<CardHeader className="pb-2">
									<CardTitle className="text-amber-900 font-serif">
										The story
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="prose prose-amber max-w-none font-serif">
										{story.data.storyContent
											.split("\n\n")
											.map((paragraph, index) => (
												<p key={index}>{paragraph}</p>
											))}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Characters content */}
						<TabsContent value="characters" className="mt-6">
							<Card className="bg-white/80 border-amber-200">
								<CardHeader className="pb-2">
									<CardTitle className="text-amber-900 font-serif">
										Main Characters
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid gap-4 md:grid-cols-2">
										{story.data.mainCharacters.map((character, index) => (
											<div
												key={index}
												className="p-4 border border-amber-100 rounded-md bg-amber-50"
											>
												<h3 className="font-serif font-bold text-amber-900 text-lg">
													{character.name}
												</h3>
												<p className="mt-1 text-amber-800">
													{character.description}
												</p>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Lessons content */}
						<TabsContent value="lessons" className="mt-6">
							<Card className="bg-white/80 border-amber-200">
								<CardHeader className="pb-2">
									<CardTitle className="text-amber-900 font-serif">
										Key Lessons
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2">
										{story.data.keyLessons.map((lesson, index) => (
											<li key={index} className="flex items-start">
												<span className="text-amber-700 mr-2 mt-1">•</span>
												<span className="text-amber-900">{lesson}</span>
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Visual descriptions content */}
						{story.data.visualDescriptions && (
							<TabsContent value="visuals" className="mt-6">
								<Card className="bg-white/80 border-amber-200">
									<CardHeader className="pb-2">
										<CardTitle className="text-amber-900 font-serif">
											Visual Scenes
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid gap-4 md:grid-cols-2">
											{story.data.visualDescriptions.map((visual, index) => (
												<div
													key={index}
													className="p-4 border border-amber-100 rounded-md bg-amber-50"
												>
													<h3 className="font-serif font-bold text-amber-900">
														{visual.scene}
													</h3>
													<p className="mt-1 text-amber-800">
														{visual.description}
													</p>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						)}

						{/* Questions content */}
						{story.data.comprehensionQuestions && (
							<TabsContent value="questions" className="mt-6">
								<Card className="bg-white/80 border-amber-200">
									<CardHeader className="pb-2">
										<CardTitle className="text-amber-900 font-serif">
											Comprehension Questions
										</CardTitle>
									</CardHeader>
									<CardContent>
										<ul className="space-y-3">
											{story.data.comprehensionQuestions.map(
												(question, index) => (
													<li key={index} className="flex items-start">
														<span className="font-bold text-amber-700 mr-2">
															{index + 1}.
														</span>
														<span className="text-amber-900">{question}</span>
													</li>
												)
											)}
										</ul>
									</CardContent>
								</Card>
							</TabsContent>
						)}

						{story.data.prayers && (
							<TabsContent value="prayer" className="mt-6">
								<Card className="bg-white/80 border-amber-200">
									<CardHeader className="pb-2">
										<CardTitle className="text-amber-900 font-serif">
											Prayers
										</CardTitle>
									</CardHeader>
									<CardContent>
										{story.data.prayers.length > 0 && (
											<ol className="flex flex-col gap-4 list-decimal ml-6 md:ml-12">
												{story.data.prayers.map((prayer) => (
													<li className="list-item" key={prayer}>
														{prayer}
													</li>
												))}
											</ol>
										)}
									</CardContent>
								</Card>
							</TabsContent>
						)}

						<TabsContent value="all" className="mt-6">
							<div className="space-y-6">
								<Card className="bg-white/80 border-amber-200">
									<CardHeader className="pb-2">
										<CardTitle className="text-amber-900 font-serif flex items-center gap-2">
											<Book className="h-5 w-5" />
											The story
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="prose prose-amber max-w-none font-serif">
											{story.data.storyContent
												.split("\n\n")
												.map((paragraph, index) => (
													<p key={index}>{paragraph}</p>
												))}
										</div>
									</CardContent>
								</Card>

								<Card className="bg-white/80 border-amber-200">
									<CardHeader className="pb-2">
										<CardTitle className="text-amber-900 font-serif flex items-center gap-2">
											<Users className="h-5 w-5" />
											Main Characters
										</CardTitle>
									</CardHeader>
									<CardContent>
										<Accordion type="single" collapsible className="w-full">
											{story.data.mainCharacters.map((character, index) => (
												<AccordionItem key={index} value={`character-${index}`}>
													<AccordionTrigger className="text-amber-900 font-serif font-medium">
														{character.name}
													</AccordionTrigger>
													<AccordionContent className="text-amber-800">
														{character.description}
													</AccordionContent>
												</AccordionItem>
											))}
										</Accordion>
									</CardContent>
								</Card>

								<Card className="bg-white/80 border-amber-200">
									<CardHeader className="pb-2">
										<CardTitle className="text-amber-900 font-serif flex items-center gap-2">
											<Lightbulb className="h-5 w-5" />
											Key Lessons
										</CardTitle>
									</CardHeader>
									<CardContent>
										<ul className="space-y-2">
											{story.data.keyLessons.map((lesson, index) => (
												<li key={index} className="flex items-start">
													<span className="text-amber-700 mr-2 mt-1">•</span>
													<span className="text-amber-900">{lesson}</span>
												</li>
											))}{" "}
										</ul>
									</CardContent>
								</Card>

								{story.data.visualDescriptions &&
									story.data.visualDescriptions.length > 0 && (
										<Card className="bg-white/80 border-amber-200">
											<CardHeader className="pb-2">
												<CardTitle className="text-amber-900 font-serif flex items-center gap-2">
													<Image className="h-5 w-5" />
													Visual Scenes
												</CardTitle>
											</CardHeader>
											<CardContent>
												<Accordion type="single" collapsible className="w-full">
													{story.data.visualDescriptions.map(
														(visual, index) => (
															<AccordionItem
																key={index}
																value={`visual-${index}`}
															>
																<AccordionTrigger className="text-amber-900 font-serif font-medium">
																	{visual.scene}
																</AccordionTrigger>
																<AccordionContent className="text-amber-800">
																	{visual.description}
																</AccordionContent>
															</AccordionItem>
														)
													)}
												</Accordion>
											</CardContent>
										</Card>
									)}

								{story.data.comprehensionQuestions &&
									story.data.comprehensionQuestions.length > 0 && (
										<Card className="bg-white/80 border-amber-200">
											<CardHeader className="pb-2">
												<CardTitle className="text-amber-900 font-serif flex items-center gap-2">
													<HelpCircle className="h-5 w-5" />
													Comprehension Questions
												</CardTitle>
											</CardHeader>
											<CardContent>
												<ul className="space-y-3">
													{story.data.comprehensionQuestions.map(
														(question, index) => (
															<li key={index} className="flex items-start">
																<span className="font-bold text-amber-700 mr-2">
																	{index + 1}.
																</span>
																<span className="text-amber-900">
																	{question}
																</span>
															</li>
														)
													)}
												</ul>
											</CardContent>
										</Card>
									)}
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
function SimplifedVerseComp({
	verseData,
	title = "Bible Verses for Your Feelings",
}: {
	verseData: {
		data: VerseResponse;
		id: string;
		userId: string | null;
		toolId: string | null;
		createdAt: Date;
		updatedAt: Date;
	};
	title: string;
}) {
	const { data } = verseData;
	const [activeTab, setActiveTab] = useState("verses");
	const [activeVerseIndex, setActiveVerseIndex] = useState(0);
	const [viewMode, setViewMode] = useState<"original" | "simplified">(
		"original"
	);

	const tabs = [
		{ id: "verses", label: "Verses", icon: <Book className="w-4 h-4 mr-2" /> },
		{
			id: "feelings",
			label: "Feelings",
			icon: <Heart className="w-4 h-4 mr-2" />,
		},
	];

	return (
		<div className="max-w-4xl mx-auto p-6 md:p-8 bg-[#f9f3e6] border border-[#e0d5c1] rounded-2xl shadow-sm">
			<div className="text-center mb-8">
				<h1 className="text-3xl md:text-4xl font-serif font-bold text-[#703f15] mb-4">
					{title}
				</h1>
				<div className="flex justify-center mb-4">
					<div className="w-24 h-1 bg-[#b06923]"></div>
				</div>

				<div className="flex flex-wrap justify-center gap-2 mt-4">
					{data.feelings.length > 0 &&
						data.feelings.map((feeling, index) => (
							<span
								key={index}
								className="inline-block px-3 py-1 bg-[#f0e6d2] text-[#703f15] rounded-full text-sm font-medium"
							>
								{feeling}
							</span>
						))}
				</div>
			</div>

			<div className="mb-6 overflow-x-auto">
				<div className="flex space-x-1 p-1 bg-[#f5ead7] rounded-xl border border-[#e0d5c1] min-w-max">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
								activeTab === tab.id
									? "bg-white text-[#703f15] font-medium shadow-sm"
									: "text-[#8c6d4f] hover:bg-[#f0e6d2]"
							}`}
						>
							{tab.icon}
							{tab.label}
						</button>
					))}
				</div>
			</div>

			<div className="bg-white rounded-xl p-5 border border-[#e0d5c1]">
				{activeTab === "verses" && (
					<>
						{data.bibleVerses.length > 1 && (
							<div className="flex mb-4 overflow-x-auto pb-2">
								{data.bibleVerses.map((verse, index) => (
									<button
										key={index}
										onClick={() => setActiveVerseIndex(index)}
										className={`px-4 py-2 mr-2 rounded-lg text-sm whitespace-nowrap ${
											activeVerseIndex === index
												? "bg-[#f0e6d2] text-[#703f15] font-medium"
												: "bg-[#f9f3e6] text-[#8c6d4f] hover:bg-[#f5ead7]"
										}`}
									>
										{verse.reference}
									</button>
								))}
							</div>
						)}

						{data.bibleVerses.length > 0 && (
							<div className="mb-6">
								<div className="flex justify-between items-center mb-4">
									<h2 className="text-xl font-serif font-bold text-[#703f15]">
										{data.bibleVerses[activeVerseIndex].reference}
									</h2>
									<div className="flex bg-[#f5ead7] rounded-lg p-1">
										<button
											onClick={() => setViewMode("original")}
											className={`px-3 py-1 text-xs rounded-md ${
												viewMode === "original"
													? "bg-white text-[#703f15] shadow-sm"
													: "text-[#8c6d4f]"
											}`}
										>
											Original
										</button>
										<button
											onClick={() => setViewMode("simplified")}
											className={`px-3 py-1 text-xs rounded-md flex items-center ${
												viewMode === "simplified"
													? "bg-white text-[#703f15] shadow-sm"
													: "text-[#8c6d4f]"
											}`}
										>
											<Lightbulb className="w-3 h-3 mr-1" />
											Simplified
										</button>
									</div>
								</div>

								<div className="p-4 bg-[#f9f3e6] rounded-lg border border-[#e0d5c1]">
									<p className="text-[#4a3520] leading-relaxed">
										{viewMode === "original"
											? data.bibleVerses[activeVerseIndex].bibleVerse
											: data.bibleVerses[activeVerseIndex]
													.simplifiedVersionOfBibleVerse}
									</p>
								</div>
							</div>
						)}
					</>
				)}

				{activeTab === "feelings" && (
					<div className="mb-6">
						<h2 className="text-xl font-serif font-bold text-[#703f15] mb-4">
							Feelings & Emotions
						</h2>
						{data.feelings.length > 0 ? (
							<div className="grid gap-3">
								{data.feelings.map((feeling, index) => (
									<div
										key={index}
										className="p-4 bg-[#f9f3e6] rounded-lg border border-[#e0d5c1]"
									>
										<div className="flex items-center">
											<Heart className="w-5 h-5 text-[#b06923] mr-2" />
											<span className="text-[#4a3520] font-medium">
												{feeling}
											</span>
										</div>
										<p className="mt-2 text-[#8c6d4f] text-sm">
											These verses express or address feelings of{" "}
											{feeling.toLowerCase()}.
										</p>
									</div>
								))}
							</div>
						) : (
							<p className="text-[#8c6d4f] italic">
								No feelings have been identified.
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
