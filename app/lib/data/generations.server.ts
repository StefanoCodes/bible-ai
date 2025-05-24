import { and, desc, eq } from "drizzle-orm";
import { data, redirect } from "react-router";
import { db } from "~/db/index.server";
import { generationsTable, toolsTable, type User } from "~/db/schema";
import { createSupabaseServerClient } from "~/server";

export async function getRecentGenerationsActivity(request: Request, limit: number = 3) {
    const { client, headers } = createSupabaseServerClient(request);
    const { auth } = client;
    const { data: supabase } = await auth.getUser();
    if (!supabase.user?.id) throw redirect("/");
    try {
        const recentGenerations = await db.select().from(generationsTable).where(and(
            eq(generationsTable.userId, supabase.user.id)
        )).leftJoin(toolsTable, eq(generationsTable.toolId, toolsTable.id)).limit(limit).orderBy(desc(generationsTable.createdAt));
        return data({ recentGenerations: recentGenerations })
    } catch (e) {
        console.error('🔴 Error Fetching latest generations:', e)
        return data({ recentGenerations: [] }, {
            status: 403,
        })
    }
}