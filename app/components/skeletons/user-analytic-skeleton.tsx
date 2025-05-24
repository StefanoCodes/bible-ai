import { cn } from "~/lib/utils";

interface StorySkeletonProps {
	className?: string;
}
export function UserAnalyticSkeleton({ className }: StorySkeletonProps) {
	return (
		<div
			className={cn(
				"w-full rounded-xl border max-w-md mx-auto border-amber-200 bg-amber-50/50 h-[44px] p-4",
				className
			)}
		>
			{/* Title skeleton */}
			<div className="h-4 w-3/4 animate-pulse rounded-md bg-amber-100/70" />
		</div>
	);
}

export function UserAnalyticsListSkeleton({ limit = 3 }: { limit?: number }) {
	return (
		<div className="flex flex-row gap-6 h-full">
			{Array.from({ length: limit }).map((item, idx) => (
				<UserAnalyticSkeleton key={idx} />
			))}
		</div>
	);
}
