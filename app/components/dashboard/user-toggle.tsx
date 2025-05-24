import {
	Book,
	Calendar,
	PenTool,
	ReceiptIcon,
	Settings,
	Table,
	User2,
} from "lucide-react";

import { Link } from "react-router";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useDashboardLoaderData } from "~/routes/dashboard/layout";
import { SignOutButton } from "../globals/sign-out";

export function UserToggle({ className }: { className?: string }) {
	const {
		user: { name, email },
	} = useDashboardLoaderData();
	const displayName =
		name.slice(0, 1).toUpperCase() + name.slice(-1).toUpperCase();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className={className}>
				<Button className=" h-8 w-8 cursor-pointer rounded-full bg-amber-800 hover:bg-amber-900 text-amber-50">
					<User2 className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
				side={"bottom"}
				align="end"
				sideOffset={6}
			>
				<DropdownMenuLabel className="p-0 font-normal" asChild>
					{/* Profile Link */}
					<Link to={"/dashboard/profile"} className="cursor-pointer">
						<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarFallback className="rounded-lg">
									{displayName}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{name}</span>
								<span className="truncate text-xs">{email}</span>
							</div>
						</div>
					</Link>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link to={"/dashboard/generations"} className="cursor-pointer">
						<Book className="size-4" />
						Generations
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link to={"/dashboard/tools"} className="cursor-pointer">
						<PenTool className="size-4" />
						Tools
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link to={"/dashboard/profile"} className="cursor-pointer">
						<Settings className="size-4" />
						Settings
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<SignOutButton />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
