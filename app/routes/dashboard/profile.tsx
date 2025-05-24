import EditUserInformationForm from "~/components/dashboard/edit-user-info";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { formatDate } from "~/lib/utils";
import { useDashboardLoaderData } from "./layout";
import { useFetcher } from "react-router";
const initials = (str: string | undefined) => {
	if (!str) return;
	return str.slice(0, 1).toUpperCase() + str.slice(-1).toUpperCase();
};
export default function UserSettings() {
	const {
		user: { email, name, createdAt, userId },
	} = useDashboardLoaderData();
	const fetcher = useFetcher({
		key: "profile-update",
	});
	const optimistic = fetcher.formData?.get("name") as string;
	const displayName = initials(optimistic) ?? initials(name);
	const fullName = optimistic ?? name;

	return (
		<div className="w-full">
			<div className="relative w-full">
				{/* Full-width Gradient Banner */}
				<div
					className=" h-40 w-full rounded-md border-4 border-amber-800/20 bg-amber-50 shadow-sm  sm:h-48 md:h-56"
					aria-hidden="true"
				/>

				{/* Content Container */}
				<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					{/* Profile Picture Container */}
					<div className="absolute -top-16 left-1/2 -translate-x-1/2 sm:-top-20 md:-top-24">
						<div className="relative h-32 w-32 sm:h-40 sm:w-40">
							{/* Gradient Border Container */}
							<div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-600 via-amber-800 to-amber-700 p-1">
								<Avatar className="h-full w-full rounded-full">
									<AvatarFallback className="bg-amber-800 text-white">
										{displayName}
									</AvatarFallback>
								</Avatar>
							</div>
						</div>
					</div>
					{/* Profile Info */}
					<div className="mb-4 pb-4 pt-20 text-center sm:pt-24 md:pt-28">
						<h1 className="text-2xl capitalize font-semibold text-gray-900 sm:text-3xl">
							{fullName}
						</h1>
						<div className="mt-2 flex items-center justify-center gap-1 text-base text-muted-foreground sm:text-lg">
							<span>Registered on:</span>
							<span>{formatDate(createdAt)}</span>
						</div>
					</div>
				</div>
				{/* USER INFORMATION / EDIT FORM */}
				<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
					<EditUserInformationForm name={fullName} email={email} />
				</div>
			</div>
		</div>
	);
}
