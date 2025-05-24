import { redirect } from "react-router";
import { data, useNavigation, useRouteLoaderData } from "react-router";
import { getRecentGenerationsActivity } from "~/lib/data/generations.server";
import { GetUserAnalytics, GetUserDetails } from "~/lib/data/user.server";
import type { Route } from "./+types/layout";
import { dailyBibleVerse } from "~/lib/data/verse.server";
import { UpgradeModalProvider } from "~/components/globals/upgrade-modal";
import { DashboardNavbar } from "~/components/dashboard/navbar";
import { Outlet } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
	const { user } = await GetUserDetails(request);
	if (!user) throw redirect("/");
	// non critical data
	const recentGenerations = getRecentGenerationsActivity(request);
	const userAnalytics = GetUserAnalytics(request);
	// get daily bible verse
	const {
		data: { verseData, headers },
	} = await dailyBibleVerse(request);

	return data(
		{ user, verseData, recentGenerations, userAnalytics },
		{ headers }
	);
}
export function useDashboardLoaderData() {
	const data = useRouteLoaderData<typeof loader>("routes/dashboard/layout");
	if (!data)
		throw Error(
			"Cannot use Dashboard Layout Loader Data as the route is not a child of it"
		);
	return data;
}
export default function Layout() {
	const navigation = useNavigation();
	const isLoading = navigation.state === "loading";
	return (
		<UpgradeModalProvider>
			<div className="min-h-dvh bg-amber-50">
				<DashboardNavbar />

				<main className="pt-4 px-4 max-w-7xl mx-auto">
					<Outlet />
				</main>
			</div>
		</UpgradeModalProvider>
	);
}
