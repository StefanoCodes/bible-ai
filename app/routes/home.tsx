import { BookOpen, Lightbulb, Menu, MessageSquare, Users } from "lucide-react";
import { data, Link, useFetcher, useLoaderData } from "react-router";
import { Card } from "~/components/ui/card";
import { UseRootLoaderData } from "~/root";
import type { Route } from "./+types/home";
import {
	storyRequestSchema,
	type StoryResponse,
} from "~/lib/zod/generations/simplify-bible-story";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect } from "react";
import {
	Form,
	FormLabel,
	FormField,
	FormItem,
	FormMessage,
	FormControl,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { SimplifiedStoryComp } from "./dashboard/generation";
import { TextShimmer } from "~/components/motion/text-shimmer";
import { AnimatePresence } from "motion/react";
import { motion as m } from "motion/react";
import { GetStarted } from "~/components/globals/get-started";

type FetcherResponse = {
	success: boolean;
	message: string;
	data: StoryResponse | null;
};
export default function Home() {
	return (
		<div className="min-h-dvh bg-amber-50">
			<Navbar />
			<HeroSection />
			<FeaturesSection />
			<ExampleSection />
			<TestimonialsSection />
			<CTASection />
			<Footer />
		</div>
	);
}

function Navbar() {
	const user = UseRootLoaderData();
	return (
		<nav className="border-b-4 border-amber-800/20 bg-amber-50 sticky top-0 z-50 shadow-sm">
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

					<div className="hidden md:flex items-center space-x-8">
						<Link
							to="#features"
							className="text-amber-800 hover:text-amber-900 font-medium"
						>
							Features
						</Link>
						<Link
							to="#examples"
							className="text-amber-800 hover:text-amber-900 font-medium"
						>
							Examples
						</Link>
						<Link
							to="#testimonials"
							className="text-amber-800 hover:text-amber-900 font-medium"
						>
							Testimonials
						</Link>
						<Link
							to="#pricing"
							className="text-amber-800 hover:text-amber-900 font-medium"
						>
							Pricing
						</Link>
					</div>
					<div className="hidden md:flex items-center space-x-4">
						{user && user.id ? (
							<Button
								variant="outline"
								className="border-amber-800 text-amber-800 hover:bg-amber-100"
								asChild
							>
								<Link to={"/dashboard"}>Dashboard</Link>
							</Button>
						) : (
							<>
								<Button
									variant="outline"
									className="border-amber-800 text-amber-800 hover:bg-amber-100"
									asChild
								>
									<Link to={"/sign-in"}>Sign In</Link>
								</Button>
								<GetStarted />
							</>
						)}
					</div>

					<div className="md:hidden">
						<Button variant="ghost" size="icon" className="text-amber-800">
							<Menu className="h-6 w-6" />
						</Button>
					</div>
				</div>
			</div>
		</nav>
	);
}

function HeroSection() {
	const user = UseRootLoaderData();
	return (
		<section className="relative" id="hero">
			<div className="border-8 border-amber-800/20 rounded-lg m-4 md:m-8 p-8 md:p-12 bg-amber-50 shadow-md">
				<div className="max-w-4xl mx-auto">
					<div className="text-center space-y-6 py-12 md:py-20">
						<h1 className="text-4xl md:text-6xl font-serif font-bold text-amber-900">
							Bible Companion AI
						</h1>
						<p className="text-xl md:text-2xl text-amber-800 font-serif italic">
							"Understanding Scripture Made Simple"
						</p>
						<p className="text-lg md:text-xl text-amber-700 max-w-3xl mx-auto">
							Explore the Bible with our AI companion that simplifies stories,
							provides context, and helps you connect with Scripture in
							meaningful ways.
						</p>
						<div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
							{user && user.id ? (
								<Button
									variant="outline"
									className="border-amber-800 text-amber-800 hover:bg-amber-100"
									asChild
								>
									<Link to={"/dashboard"}>Dashboard</Link>
								</Button>
							) : (
								<GetStarted />
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function FeaturesSection() {
	const features = [
		{
			title: "Simplified Stories",
			description:
				"Complex biblical narratives explained in simple, easy-to-understand language.",
			icon: <BookOpen className="h-10 w-10 text-amber-700" />,
		},
		{
			title: "Interactive Conversations",
			description:
				"Ask questions and receive thoughtful, scripture-based responses.",
			icon: <MessageSquare className="h-10 w-10 text-amber-700" />,
		},
		{
			title: "Spiritual Insights",
			description:
				"Gain deeper understanding of biblical principles and their application.",
			icon: <Lightbulb className="h-10 w-10 text-amber-700" />,
		},
		{
			title: "Community Sharing",
			description: "Share insights and discoveries with friends and family.",
			icon: <Users className="h-10 w-10 text-amber-700" />,
		},
	];

	return (
		<section className="py-16 px-4" id="features">
			<div className="max-w-6xl mx-auto">
				<h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 text-center mb-12">
					Discover the Word in New Ways
				</h2>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
					{features.map((feature, index) => (
						<Card
							key={index}
							className="border-4 border-amber-800/20 bg-amber-50 p-6 flex flex-col items-center text-center"
						>
							<div className="mb-4">{feature.icon}</div>
							<h3 className="text-xl font-serif font-bold text-amber-900 mb-2">
								{feature.title}
							</h3>
							<p className="text-amber-700">{feature.description}</p>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}

function ExampleSection() {
	const customFetcher = useFetcher<FetcherResponse>();
	const isPending = customFetcher.state !== "idle";
	const form = useForm({
		resolver: zodResolver(storyRequestSchema),
		mode: "onSubmit",
		defaultValues: {
			title: "",
			originalReferences: "",
			ageGroup: undefined,
		},
	});

	useEffect(() => {
		if (customFetcher.data) {
			if (customFetcher.data?.success) {
				toast.success(customFetcher.data.message);
			} else {
				toast.error(customFetcher.data.message);
			}
		}
	}, [customFetcher.data]);
	return (
		<section className="py-16 px-4 bg-amber-100/50" id="examples">
			<div className="max-w-6xl mx-auto">
				<h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 text-center mb-12">
					See It In Action
				</h2>

				<div className="border-8 border-amber-800/20 rounded-lg bg-amber-50 p-6 md:p-8 shadow-md">
					<div className="text-center mb-6 flex flex-col gap-4">
						<h3 className="text-2xl md:text-3xl font-serif font-bold text-amber-900">
							Simplify a bible story
						</h3>
						<p className="text-amber-800 italic">
							Insert a title of a bible story and your age group and watch ai
							simplify the story for you
						</p>
					</div>

					<div className="flex flex-col md:flex-row gap-8">
						<div className="flex-1 transition-all ease-in-out duration-1000">
							<Form {...form}>
								<customFetcher.Form
									action="/resource/generations"
									method="POST"
									onSubmit={form.handleSubmit((data) => {
										console.log(data);
										customFetcher.submit(
											{
												...data,
												intent: "simplify-bible-story",
											},
											{
												action: "/resource/generations",
												method: "POST",
											}
										);
									})}
								>
									<div className="flex flex-col gap-6">
										<FormField
											control={form.control}
											name="title"
											disabled={isPending}
											render={({ field }) => (
												<FormItem>
													<FormLabel
														htmlFor="title"
														className="font-serif text-amber-900"
													>
														Title
													</FormLabel>
													<Input
														type="text"
														id="title"
														placeholder="David & Goliath"
														className="border-amber-800/30 focus:border-amber-800 focus:ring-amber-800 bg-amber-50"
														{...field}
													/>
													<FormMessage className="text-red-600" />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											disabled={isPending}
											name="ageGroup"
											render={({ field }) => (
												<FormItem>
													<FormLabel
														htmlFor={"age-group"}
														className="font-serif text-amber-900"
													>
														Age Group
													</FormLabel>
													<FormControl>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
															disabled={isPending}
														>
															<SelectTrigger className="flex w-full justify-between border-amber-800/30 focus:border-amber-800 focus:ring-amber-800 bg-amber-50 text-amber-900">
																<SelectValue
																	placeholder={"Select an age group"}
																/>
															</SelectTrigger>
															<SelectContent className="bg-amber-50 border-amber-800/30">
																<SelectGroup>
																	<SelectItem
																		value="children"
																		className="text-amber-900 hover:bg-amber-100"
																	>
																		Child
																	</SelectItem>
																	<SelectItem
																		value="teenagers"
																		className="text-amber-900 hover:bg-amber-100"
																	>
																		Teen
																	</SelectItem>

																	<SelectItem
																		value="adults"
																		className="text-amber-900 hover:bg-amber-100"
																	>
																		Adult
																	</SelectItem>
																</SelectGroup>
															</SelectContent>
														</Select>
													</FormControl>
													<FormMessage className="text-red-600" />
												</FormItem>
											)}
										/>
										<Button
											type="submit"
											disabled={isPending}
											className="w-full cursor-pointer bg-amber-800 hover:bg-amber-900 text-amber-50"
										>
											{isPending ? "Generating..." : "Generate"}
										</Button>
									</div>
								</customFetcher.Form>
							</Form>
						</div>

						<div className="flex-1 rounded-lg  bg-amber-50 h-full">
							<AnimatePresence>
								{customFetcher.data?.data?.title && (
									<m.div
										initial={{
											opacity: 0,
											y: 40,
										}}
										animate={{
											opacity: 1,
											y: 0,
										}}
										exit={{
											opacity: 0,
											y: 0,
										}}
									>
										<SimplifiedStoryComp
											// @ts-ignore
											story={{
												data: customFetcher.data?.data,
											}}
										/>
									</m.div>
								)}
							</AnimatePresence>
							{!customFetcher.data?.data?.title && (
								<div className="flex items-center justify-center h-full min-h-[300px]">
									{!customFetcher.data?.data?.title && !isPending && (
										<p className="text-center self-center justify-center  h-full text-amber-800">
											Go ahead and try it
										</p>
									)}
									{isPending && (
										<TextShimmer className="font-mono text-sm" duration={1}>
											Generating story...
										</TextShimmer>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function TestimonialsSection() {
	const testimonials = [
		{
			quote:
				"This app has transformed my daily devotional time. The simplified explanations help me understand passages I've struggled with for years.",
			author: "Sarah K., Sunday School Teacher",
		},
		{
			quote:
				"As a pastor, I use Bible Companion AI to help prepare lessons that connect with all age groups in my congregation.",
			author: "Pastor Michael J.",
		},
		{
			quote:
				"My children love using this app! It's helped them engage with Bible stories in a way that's meaningful and accessible.",
			author: "Rebecca T., Parent",
		},
	];

	return (
		<section className="py-16 px-4" id="testimonials">
			<div className="max-w-6xl mx-auto">
				<h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 text-center mb-12">
					What Our Users Say
				</h2>

				<div className="grid md:grid-cols-3 gap-8">
					{testimonials.map((testimonial, index) => (
						<Card
							key={index}
							className="border-4 border-amber-800/20 bg-amber-50 p-6"
						>
							<p className="text-amber-700 italic mb-4">
								"{testimonial.quote}"
							</p>
							<p className="text-amber-900 font-semibold">
								— {testimonial.author}
							</p>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}

function CTASection() {
	return (
		<section className="py-16 px-4 bg-amber-100/50" id="pricing">
			<div className="max-w-6xl mx-auto">
				<div className="border-8 border-amber-800/20 rounded-lg bg-amber-50 p-8 md:p-12 text-center shadow-md">
					<h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-6">
						Begin Your Scripture Journey Today
					</h2>
					<p className="text-lg text-amber-700 max-w-3xl mx-auto mb-8">
						Join thousands of believers who are deepening their understanding of
						God's Word through our AI companion.
					</p>
					<div className="flex flex-col sm:flex-row justify-center gap-4">
						<GetStarted className="h-12 text-base">
							Create free account
						</GetStarted>
					</div>
				</div>
			</div>
		</section>
	);
}

function Footer() {
	return (
		<footer className="bg-amber-900 text-amber-50 py-12 px-4">
			<div className="max-w-6xl mx-auto">
				<div className="grid md:grid-cols-4 gap-8">
					<div>
						<h3 className="font-serif font-bold text-xl mb-4">
							Bible Companion AI
						</h3>
						<p className="text-amber-200">
							Understanding Scripture Made Simple
						</p>
					</div>
					<div>
						<h4 className="font-serif font-bold mb-4">Features</h4>
						<ul className="space-y-2">
							<li>
								<Link to="#" className="text-amber-200 hover:text-white">
									Simplified Stories
								</Link>
							</li>
							<li>
								<Link to="#" className="text-amber-200 hover:text-white">
									Interactive Conversations
								</Link>
							</li>
							<li>
								<Link to="#" className="text-amber-200 hover:text-white">
									Spiritual Insights
								</Link>
							</li>
							<li>
								<Link to="#" className="text-amber-200 hover:text-white">
									Community Sharing
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="font-serif font-bold mb-4">Resources</h4>
						<ul className="space-y-2">
							<li>
								<Link to="#" className="text-amber-200 hover:text-white">
									Blog
								</Link>
							</li>
							<li>
								<Link to="#" className="text-amber-200 hover:text-white">
									Tutorials
								</Link>
							</li>
							<li>
								<Link to="#" className="text-amber-200 hover:text-white">
									FAQ
								</Link>
							</li>
							<li>
								<Link to="#" className="text-amber-200 hover:text-white">
									Support
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="font-serif font-bold mb-4">Company</h4>
						<ul className="space-y-2">
							<li>
								<Link to="#" className="text-amber-200 hover:text-white">
									About Us
								</Link>
							</li>
							<li>
								<Link to="#" className="text-amber-200 hover:text-white">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link to="#" className="text-amber-200 hover:text-white">
									Terms of Service
								</Link>
							</li>
							<li>
								<Link to="#" className="text-amber-200 hover:text-white">
									Contact
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className="border-t border-amber-800 mt-8 pt-8 text-center text-amber-200">
					<p>
						© {new Date().getFullYear()} Bible Companion AI. All rights
						reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
