import { BookOpen, History, MessageSquare, Sparkles, Star } from "lucide-react";
import React, { Suspense, use } from "react";
import { Link } from "react-router";
import { RecentActivitySkeletonList } from "~/components/skeletons/recent-activity-skeleton";
import { UserAnalyticsListSkeleton } from "~/components/skeletons/user-analytic-skeleton";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import type { Generation, Tool } from "~/db/schema";
import { formatDate } from "~/lib/utils";
import type { StoryResponse } from "~/lib/zod/generations/simplify-bible-story";
import type { VerseResponse } from "~/lib/zod/generations/simplify-bible-verse";
import type { Route } from "./+types/home";
import { useDashboardLoaderData } from "./layout";
import { getToolIcon } from "~/components/generations/tool-icon";
// Quick access features
const quickAccessFeatures = [
	{
		title: "Simplify Bible Stories",
		description: "Convert complex passages into easy-to-understand language",
		icon: <Sparkles className="h-6 w-6 text-amber-700" />,
		link: "/dashboard/tools",
		color: "bg-amber-100",
	},
	{
		title: "Ask Questions",
		description: "Get answers about Scripture and biblical concepts",
		icon: <MessageSquare className="h-6 w-6 text-amber-700" />,
		link: "/dashboard/conversations",
		color: "bg-amber-100",
	},
	{
		title: "Recent Generations",
		description: "View your recently simplified Bible stories",
		icon: <History className="h-6 w-6 text-amber-700" />,
		link: "#recent",
		color: "bg-amber-100",
	},
	{
		title: "Saved Favorites",
		description: "Access your bookmarked content",
		icon: <Star className="h-6 w-6 text-amber-700" />,
		link: "/dashboard/favorites",
		color: "bg-amber-100",
	},
];

export default function DashboardIndex({ loaderData }: Route.ComponentProps) {
	const { user } = useDashboardLoaderData();
	const userName = user.name;

	return (
		<div className="py-8">
			{/* Welcome Section */}
			<div className="border-8 border-amber-800/20 rounded-lg bg-amber-50 p-6 md:p-8 shadow-md mb-8">
				<div className="flex items-center gap-4 mb-4">
					<div className="bg-amber-100 p-3 rounded-full border border-amber-800/20">
						<BookOpen className="h-8 w-8 text-amber-800" />
					</div>
					<div>
						<h1 className="text-3xl capitalize font-serif font-bold text-amber-900">
							Welcome, {userName}
						</h1>
						<p className="text-amber-700">
							What would you like to explore in Scripture today?
						</p>
					</div>
				</div>

				<div className="flex flex-col md:flex-row gap-4 mt-6">
					<DailyVerse />
					<div className="bg-amber-100/50 h-fit rounded-lg md:flex-[0.6] p-4 border border-amber-800/20">
						<h3 className="font-serif font-semibold text-amber-900 mb-2">
							Your Stats
						</h3>
						<Suspense fallback={<UserAnalyticsListSkeleton />}>
							<UserAnalytics />
						</Suspense>
					</div>
				</div>
			</div>

			{/* Quick Access Section */}
			<h2 className="text-2xl font-serif font-bold text-amber-900 mb-4">
				Quick Access
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				{quickAccessFeatures.map((feature, index) => (
					<Link
						key={index}
						to={feature.link}
						className="border-4 border-amber-800/20 rounded-lg bg-amber-50 p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:border-amber-800/40 flex flex-col h-full"
					>
						<div
							className={`${feature.color} p-3 rounded-lg border border-amber-800/20 w-fit mb-4`}
						>
							{feature.icon}
						</div>
						<h3 className="text-lg font-serif font-bold text-amber-900 mb-2">
							{feature.title}
						</h3>
						<p className="text-amber-700 text-sm flex-grow">
							{feature.description}
						</p>
					</Link>
				))}
			</div>

			{/* Recent Activity Section */}
			<h2 className="text-2xl font-serif font-bold text-amber-900 mb-4">
				Recent Activity
			</h2>
			<div className="border-4 border-amber-800/20 rounded-lg bg-amber-50 p-6 shadow-md">
				<div className="w-full">
					<Suspense fallback={<RecentActivitySkeletonList />}>
						<RecentGenerationsActivity />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
function DailyVerse() {
	const { verseData } = useDashboardLoaderData();

	const { bibleVerseReference, keyTakeaways, verse } = verseData;
	return (
		<div className="bg-amber-100/50 md:flex-1 rounded-lg p-4 border border-amber-800/20">
			<h3 className="font-serif font-semibold text-amber-900 mb-2">
				Daily Verse
			</h3>
			<p className="text-amber-800 italic">{verse}</p>
			<p className="text-amber-700 text-sm mt-2">{bibleVerseReference}</p>
			<div className="flex flex-col gap-2 mt-4">
				<p className="font-serif font-semibold text-amber-900 mb-2">
					key takeaways:
				</p>
				<div className="flex flex-col gap-4">
					{keyTakeaways.map((takeaway) => (
						<p className="text-amber-800 text-xs" key={takeaway}>
							{takeaway}
						</p>
					))}
				</div>
			</div>
		</div>
	);
}
function UserAnalytics() {
	const {
		userAnalytics,
		user: { tokens },
	} = useDashboardLoaderData();
	const userAnalyticsPromise = use(userAnalytics);
	const storiesCount = userAnalyticsPromise?.storiesCount.count ?? 0;
	const versesCount = userAnalyticsPromise?.versesCount.count ?? 0;
	return (
		<div className="flex justify-between items-center">
			<div className="flex flex-col gap-2">
				<p className="text-amber-700 text-sm">Stories Simplified</p>
				<p className="text-amber-900 font-bold">{storiesCount}</p>
			</div>
			<div className="flex flex-col gap-2">
				<p className="text-amber-700 text-sm">Verses Simplified</p>
				<p className="text-amber-900 font-bold">{versesCount}</p>
			</div>
			<div className="flex flex-col gap-2">
				<p className="text-amber-700 text-sm">Credits Remaining</p>
				<p className="text-amber-900 font-bold">{tokens}</p>
			</div>
		</div>
	);
}
function RecentGenerationsActivity() {
	const { recentGenerations } = useDashboardLoaderData();
	const recentGenerationsPromise = use(recentGenerations);
	return (
		<>
			{recentGenerationsPromise.data.recentGenerations.length > 0 ? (
				<RecentActivity
					recentGenerations={recentGenerationsPromise.data.recentGenerations}
				/>
			) : (
				<NoRecentActivity />
			)}
		</>
	);
}
function NoRecentActivity() {
	return (
		<div className="flex flex-col items-center justify-center">
			<p className="text-amber-700 mb-6">
				You haven't created any content yet. Start by simplifying a Bible story
				or asking a question.
			</p>
			<div className="flex flex-col sm:flex-row gap-4 justify-center">
				<Link
					to="/dashboard/tools"
					className="inline-flex items-center justify-center px-4 py-2 bg-amber-800 text-amber-50 rounded-md hover:bg-amber-900 transition-colors"
				>
					<Sparkles className="h-4 w-4 mr-2" />
					Simplify a Story
				</Link>
				<Link
					to="/dashboard/conversations"
					className="inline-flex items-center justify-center px-4 py-2 border border-amber-800 text-amber-800 rounded-md hover:bg-amber-100 transition-colors"
				>
					<MessageSquare className="h-4 w-4 mr-2" />
					Ask a Question
				</Link>
			</div>
		</div>
	);
}
function RecentActivity({
	recentGenerations,
}: {
	recentGenerations: {
		generations: Generation;
		tools: Tool | null;
	}[];
}) {
	return (
		<div id="recent" className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
			{recentGenerations.map(({ generations: generation, tools: tool }) => (
				<React.Fragment key={generation.id}>
					{tool?.intent === "simplify-bible-story" && (
						<RecentActivitySimplifyBibleStoryCard
							generation={generation}
							tool={tool}
						/>
					)}
					{tool?.intent === "simplify-bible-verse" && (
						<RecentActivitySimplifyBibleVerse
							generation={generation}
							tool={tool}
						/>
					)}
				</React.Fragment>
			))}
		</div>
	);
}
function RecentActivitySimplifyBibleStoryCard({
	generation,
	tool,
}: {
	generation: Generation;
	tool: Tool;
}) {
	const generatedContent = generation.data as StoryResponse;
	return (
		<Link to={`/dashboard/generations/${tool.intent}/${generation.id}`}>
			<Card className="bg-amber-50 w-full">
				<CardHeader>
					<CardTitle className="text-amber-800 truncate text-2xl">
						{generatedContent?.title}
					</CardTitle>
					<CardDescription className="truncate text-amber-900">
						{generatedContent.summary}
					</CardDescription>
					<CardContent className="px-0">
						<div className="flex flex-col gap-4 px-0">
							<p className="text-sm max-w-prose text-amber-700">
								Created on: {formatDate(generation.createdAt)}
							</p>
							<p className="text-sm max-w-prose flex flex-row items-center gap-1 text-amber-700 font-medium">
								{getToolIcon(tool.intent)}
								<span className="font-medium">{tool.name}</span>
							</p>
						</div>
					</CardContent>
				</CardHeader>
			</Card>
		</Link>
	);
}
function RecentActivitySimplifyBibleVerse({
	generation,
	tool,
}: {
	generation: Generation;
	tool: Tool;
}) {
	const generatedContent = generation.data as VerseResponse;
	const { bibleVerse, reference, simplifiedVersionOfBibleVerse } =
		generatedContent.bibleVerses[0];
	return (
		<Link to={`/dashboard/generations/${tool.intent}/${generation.id}`}>
			<Card className="bg-amber-50 w-full">
				<CardHeader>
					<CardTitle className="text-amber-800 truncate text-2xl">
						{bibleVerse}
					</CardTitle>
					<CardDescription className="truncate text-amber-900">
						{reference}
					</CardDescription>
					<CardContent className="px-0">
						<div className="flex flex-col gap-4 px-0">
							<p className="text-sm max-w-prose text-amber-700">
								Created on: {formatDate(generation.createdAt)}
							</p>
							<p className="text-sm max-w-prose flex flex-row items-center gap-1 text-amber-700 font-medium">
								{getToolIcon(tool.intent)}
								<span className="font-medium">{tool.name}</span>
							</p>
						</div>
					</CardContent>
				</CardHeader>
			</Card>
		</Link>
	);
}
