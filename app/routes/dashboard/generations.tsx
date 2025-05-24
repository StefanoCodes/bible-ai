import { Link, redirect } from "react-router";
import { createSupabaseServerClient } from "~/server";
import { db } from "~/db/index.server";
import { toolsTable } from "~/db/schema";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import type { Route } from "./+types/generations";
import { getToolIcon } from "~/components/generations/tool-icon";

export async function loader({ request }: Route.LoaderArgs) {
	// auth check
	const { client } = createSupabaseServerClient(request);
	const { auth } = client;
	const { data: supabase } = await auth.getUser();
	if (!supabase.user?.id) throw redirect("/sign-up");
	// get the tools from the db
	try {
		const tools = await db
			.select({
				toolId: toolsTable.id,
				toolName: toolsTable.name,
				toolIntent: toolsTable.intent,
			})
			.from(toolsTable);
		return { tools };
	} catch (e) {
		console.error("🔴 Error Fetching Tools:", e);
		return { tools: [] };
	}
}

export default function GenerationsList({ loaderData }: Route.ComponentProps) {
	const { tools } = loaderData;

	return (
		<div className="py-8">
			<div className="border-8 border-amber-800/20 rounded-lg bg-amber-50 p-6 md:p-8 shadow-md mb-8">
				<div className="flex items-center justify-between mb-4">
					<Link
						to="/dashboard"
						className="flex items-center gap-2 text-amber-800 hover:text-amber-900 transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						<span>Back to Dashboard</span>
					</Link>
				</div>
				<p className="text-amber-700">
					Select a tool to view your generated content and insights.
				</p>
			</div>

			{tools && tools.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{tools.map(({ toolId, toolName, toolIntent }) => (
						<Link
							key={toolId}
							to={`/dashboard/tools/${toolId}`}
							className="border-4 border-amber-800/20 rounded-lg bg-amber-50 p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:border-amber-800/40"
						>
							<div className="flex items-center gap-4">
								<div className="bg-amber-100 p-3 rounded-lg border border-amber-800/20 text-amber-700">
									{getToolIcon(toolIntent)}
								</div>
								<div>
									<h2 className="text-xl font-serif font-bold text-amber-900">
										{toolName}
									</h2>
									<p className="text-amber-700 text-sm mt-1">
										View your generated content
									</p>
								</div>
							</div>
						</Link>
					))}
				</div>
			) : (
				<div className="border-4 border-amber-800/20 rounded-lg bg-amber-50 p-6 text-center">
					<p className="text-amber-700 italic">
						No tools available. Please check back later.
					</p>
				</div>
			)}
		</div>
	);
}
