import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { useFetcher } from "react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import {
	ProfileUpdateSchema,
	type ProfileUpdateRequest,
} from "~/lib/zod/auth/auth";
import { Button } from "../ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useEffect } from "react";
import { toast } from "sonner";
type FetcherResponse = {
	success: boolean;
	message: string;
};

export default function EditUserInformationForm({
	name,
	email,
}: {
	name: string;
	email: string;
}) {
	const fetcher = useFetcher<FetcherResponse>({ key: "profile-update" });
	const isPending = fetcher.state !== "idle";
	// optimistic values for the mutation
	const form = useForm<ProfileUpdateRequest>({
		resolver: zodResolver(ProfileUpdateSchema),
		defaultValues: {
			email,
			name,
		},
		mode: "onSubmit",
	});
	const isDirty = form.formState.isDirty;
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
		<Card className="mx-auto  w-full max-w-5xl bg-amber-50">
			<CardHeader>
				<CardTitle className="text-2xl font-semibold md:text-3xl">
					Edit Profile
				</CardTitle>
				<CardDescription>Update your personal information</CardDescription>
			</CardHeader>
			<Form {...form}>
				<fetcher.Form
					action="/resource/auth"
					method="POST"
					onSubmit={form.handleSubmit((formData) => {
						if (!isDirty) return;
						fetcher.submit(
							{
								...formData,
								intent: "profile",
							},
							{
								action: "/resource/auth",
								method: "POST",
							}
						);
					})}
					className="flex flex-col gap-8"
				>
					<CardContent className="flex md:flex-row flex-col items-center gap-6">
						<div className="flex-1">
							<FormField
								control={form.control}
								name="name"
								disabled={isPending}
								render={({ field }) => (
									<FormItem>
										<FormLabel
											htmlFor="name"
											className="font-serif text-amber-900"
										>
											Name
										</FormLabel>
										<Input
											type="text"
											id="name"
											placeholder="Sara Doe"
											className="border-amber-800/30 focus:border-amber-800 focus:ring-amber-800 bg-amber-50"
											{...field}
										/>
										<FormMessage className="text-red-600" />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex-1">
							<FormField
								control={form.control}
								name="email"
								disabled={isPending}
								render={({ field }) => (
									<FormItem>
										<FormLabel
											htmlFor="email"
											className="font-serif text-amber-900"
										>
											Email
										</FormLabel>
										<div className="relative">
											<Input
												type="email"
												id="email"
												className="border-amber-800/30 focus:border-amber-800 focus:ring-amber-800 bg-amber-50 relative"
												{...field}
												placeholder="example@gmail.com"
											/>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<Info className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-yellow-600" />
													</TooltipTrigger>
													<TooltipContent className="mx-2 max-w-xs p-2">
														<p>Email Verification is required</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</div>
										<FormMessage className="text-red-600" />
									</FormItem>
								)}
							/>
						</div>
					</CardContent>
					<CardFooter className="flex justify-between self-end">
						<Button
							disabled={!isDirty || isPending}
							className="bg-amber-800 hover:bg-amber-900 text-amber-50"
						>
							{isPending ? "Saving..." : "Save Changes"}
						</Button>
					</CardFooter>
				</fetcher.Form>
			</Form>
		</Card>
	);
}
