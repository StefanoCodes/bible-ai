import { Link } from "react-router";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";

export function GetStarted({
	children = "Get Started for Free",
	className,
}: {
	children?: React.ReactNode;
	className?: string;
}) {
	return (
		<Button
			className={cn("bg-amber-800 hover:bg-amber-900 text-amber-50", className)}
			asChild
		>
			<Link to={"/sign-up"}>{children}</Link>
		</Button>
	);
}
