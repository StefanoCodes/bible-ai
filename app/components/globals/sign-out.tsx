import { useEffect } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

type FetcherResponse = {
	success: boolean;
	message: string;
};

export function SignOutButton() {
	const fetcher = useFetcher<FetcherResponse>();
	const isPending = fetcher.state !== "idle";

	useEffect(() => {
		if (fetcher.data) {
			if (fetcher.data.success) {
				toast.success(fetcher.data.message);
			} else {
				toast.error(fetcher.data.message);
			}
		}
	}, [fetcher.data]);
	return (
		<fetcher.Form
			method="POST"
			onSubmit={(e) => {
				e.preventDefault();
				fetcher.submit(
					{
						intent: "sign-out",
					},
					{
						action: "/resource/auth",
						method: "POST",
					}
				);
			}}
		>
			<Button variant={"outline"} type="submit" disabled={isPending}>
				<LogOut className="w-4 h-4 text-red-500" />
				<span>Sign out</span>
			</Button>
		</fetcher.Form>
	);
}
