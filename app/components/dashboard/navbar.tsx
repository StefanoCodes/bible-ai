import { BookOpen } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";
import { MAX_TOKENS } from "~/lib/constants";
import { useDashboardLoaderData } from "~/routes/dashboard/layout";
import { UpgradeButton } from "../globals/upgrade-button";
import { UserToggle } from "./user-toggle";

const navItems = [
	{ title: "Tools", href: "/dashboard/tools" },
	{ title: "Generations", href: "/dashboard/generations" },
	{ title: "Settings", href: "/dashboard/profile" },
];

export function DashboardNavbar() {
	// use dashboard loader data
	const {
		user: { tokens },
	} = useDashboardLoaderData();
	const location = useLocation();
	const currentPath = location.pathname;

	return (
		<header className="border-b-4 border-amber-800/20 bg-amber-50 shadow-sm">
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between ">
					{/* Logo and main navigation */}
					<div className="flex items-center justify-between p-4 md:p-0 md:flex-[0.7]">
						<Link to="/dashboard" className="flex items-center">
							<BookOpen className="h-8 w-8 text-amber-800 mr-2" />
							<span className="font-serif text-xl font-bold text-amber-900">
								Bible Companion AI
							</span>
						</Link>
						<UserToggle className="md:hidden" />
					</div>
					<div className="flex flex-row items-center justify-between  flex-1">
						{/* Main navigation tabs */}
						<nav className="flex border-t  md:flex-1 border-amber-800/10 md:border-t-0">
							<ul className="flex min-w-full flex-none gap-x-6 md:gap-x-8 md:px-0">
								{navItems.map((item) => (
									<li key={item.href} className="py-3">
										<Link
											to={item.href}
											className={cn(
												"inline-flex whitespace-nowrap border-b-2 py-1.5 text-sm font-medium",
												currentPath === item.href
													? "border-amber-800 text-amber-900"
													: "border-transparent text-amber-700 hover:border-amber-800/30 hover:text-amber-900"
											)}
										>
											{item.title}
										</Link>
									</li>
								))}
							</ul>
						</nav>

						{/* Right side items */}
						<div className="flex items-center gap-4 p-4  md:flex-1">
							<div className="text-amber-800 text-sm font-medium">
								<span className="text-xs sm:text-sm">Tokens:</span> {tokens} /
								{MAX_TOKENS}
							</div>

							<div className="hidden md:flex items-center gap-3 ">
								<UpgradeButton />

								<UserToggle />
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
