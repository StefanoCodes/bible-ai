import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, redirect, useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectValue,
	SelectTrigger,
	SelectItem,
} from "~/components/ui/select";
import { signUpSchema, type SignupRequest } from "~/lib/zod/auth/auth";
import type { Route } from "./+types/sign-up";
import { useEffect } from "react";
import { toast } from "sonner";
import { createSupabaseServerClient } from "~/server";
import { HaveAnAccount } from "~/components/globals/have-an-account";
import { BookOpen } from "lucide-react";

type FetcherResponse = {
	success: boolean;
	message: string;
};

export async function loader({ request }: Route.LoaderArgs) {
	const { client } = createSupabaseServerClient(request);
	const user = await client.auth.getUser();
	if (user.data.user?.id) throw redirect("/dashboard");
	return null;
}

export default function Page() {
	const fetcher = useFetcher<FetcherResponse>();
	const isPending = fetcher.state !== "idle";
	const form = useForm<SignupRequest>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			role: undefined,
		},
	});
	// trigger toast when fetcher data sent back from the server
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
		<main className="min-h-dvh bg-amber-50">
			<nav className="border-b-4 border-amber-800/20 bg-amber-50 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center">
							<Link to="/" className="flex items-center">
								<BookOpen className="h-8 w-8 text-amber-800 mr-2" />
								<span className="font-serif text-xl font-bold text-amber-900">
									Bible Companion AI
								</span>
							</Link>
						</div>
					</div>
				</div>
			</nav>

			<div className="flex h-full w-full items-start justify-center pt-12 pb-12 max-w-7xl mx-auto">
				<div className="flex-1 justify-center max-w-md w-full flex mx-auto flex-col gap-8 px-4">
					<div className="text-center mb-4">
						<h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-900">
							Create Your Account
						</h1>
						<p className="text-amber-700 mt-2">
							Join our community and start exploring Scripture in a new way
						</p>
					</div>

					<div className="border-8 border-amber-800/20 rounded-lg bg-amber-50 p-6 md:p-8 shadow-md">
						<Form {...form}>
							<fetcher.Form
								action="/resource/auth"
								method="POST"
								onSubmit={form.handleSubmit((data) => {
									fetcher.submit(
										{
											...data,
											intent: "sign-up",
										},
										{
											action: "/resource/auth",
											method: "POST",
										}
									);
								})}
							>
								<div className="flex flex-col gap-8">
									<div className="flex flex-col gap-6">
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
													<Input
														type="email"
														id="email"
														className="border-amber-800/30 focus:border-amber-800 focus:ring-amber-800 bg-amber-50"
														{...field}
														placeholder="example@gmail.com"
													/>
													<FormMessage className="text-red-600" />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="password"
											disabled={isPending}
											render={({ field }) => (
												<FormItem>
													<FormLabel
														htmlFor="password"
														className="font-serif text-amber-900"
													>
														Password
													</FormLabel>
													<Input
														type="password"
														id="password"
														placeholder="*********"
														className="border-amber-800/30 focus:border-amber-800 focus:ring-amber-800 bg-amber-50"
														{...field}
													/>
													<FormMessage className="text-red-600" />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="role"
											disabled={isPending}
											render={({ field }) => (
												<FormItem>
													<FormLabel
														htmlFor="role"
														className="font-serif text-amber-900"
													>
														Role
													</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<SelectTrigger className="flex w-full justify-between border-amber-800/30 focus:border-amber-800 focus:ring-amber-800 bg-amber-50 text-amber-900">
															<SelectValue placeholder="Role" />
														</SelectTrigger>
														<SelectContent className="bg-amber-50 border-amber-800/30">
															<SelectGroup>
																<SelectItem
																	value="student"
																	className="text-amber-900 hover:bg-amber-100"
																>
																	Student
																</SelectItem>
																<SelectItem
																	value="teacher"
																	className="text-amber-900 hover:bg-amber-100"
																>
																	Teacher
																</SelectItem>
																<SelectItem
																	value="adult"
																	className="text-amber-900 hover:bg-amber-100"
																>
																	Adult
																</SelectItem>
															</SelectGroup>
														</SelectContent>
													</Select>
													<FormMessage className="text-red-600" />
												</FormItem>
											)}
										/>
									</div>
									<Button
										type="submit"
										disabled={isPending}
										className="bg-amber-800 hover:bg-amber-900 text-amber-50 cursor-pointer py-6 font-medium"
									>
										{isPending ? "Signing up..." : "Sign up"}
									</Button>
								</div>
							</fetcher.Form>
						</Form>
					</div>

					<div className="text-center text-amber-800">
						<HaveAnAccount type="sign-up" />
					</div>
				</div>
			</div>
		</main>
	);
}
