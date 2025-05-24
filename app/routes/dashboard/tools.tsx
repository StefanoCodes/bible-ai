import { data, redirect } from "react-router";
import DynamicToolCard from "~/components/generations/tool-card";
import { db } from "~/db/index.server";
import { toolsTable } from "~/db/schema";
import { GenerationsSchemas } from "~/lib/zod/generations/schemas";
import { createSupabaseServerClient } from "~/server";
import type { Route } from "./+types/tools";

export async function loader({ request }: Route.LoaderArgs) {
	// check for atuh
	const { client, headers } = createSupabaseServerClient(request);
	const { auth } = client;
	const { data: supabase } = await auth.getUser();
	if (!supabase.user?.id) throw redirect("/sign-up");
	// load the tools from the db
	const tools = await db.select().from(toolsTable);
	return data(
		{ tools },
		{
			headers,
		}
	);
}

// load all the tools from db and display from loader
export default function Page({ loaderData }: Route.ComponentProps) {
	const { tools } = loaderData;
	return (
		<div className="py-8">
			<div className="border-8 border-amber-800/20 rounded-lg bg-amber-50 p-6 md:p-8 shadow-md mb-8">
				<h1 className="text-3xl font-serif font-bold text-amber-900 mb-4">
					Bible Study Tools
				</h1>
				<p className="text-amber-700">
					Select a tool below to help you understand and explore Scripture in
					new ways.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{tools.map(({ description, name, systemPrompt, cost, intent, id }) => {
					const zodRequestSchema =
						GenerationsSchemas[intent as keyof typeof GenerationsSchemas];
					return (
						<DynamicToolCard
							key={id}
							title={name}
							description={description}
							dialogDescription={description}
							dialogTitle={name}
							intent={intent}
							schema={zodRequestSchema}
							toolId={id}
							toolCost={cost}
							toolSlug={intent}
						/>
					);
				})}
			</div>
		</div>
	);
}
