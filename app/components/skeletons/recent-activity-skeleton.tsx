import { cn } from "~/lib/utils";

interface StorySkeletonProps {
	className?: string;
}
export function RecentActivitySkeleton({ className }: StorySkeletonProps) {
	return (
		<div
			className={cn(
				"w-full rounded-xl border max-w-4xl mx-auto border-amber-200 bg-amber-50/50 h-[133.587px] p-6",
				className
			)}
		>
			{/* Title skeleton */}
			<div className="h-4 w-3/4 animate-pulse rounded-md bg-amber-100/70" />

			{/* Description skeleton - two lines */}
			<div className="mt-4 space-y-2">
				<div className="h-3 w-full animate-pulse rounded-md bg-amber-100/70" />
				<div className="h-3 w-11/12 animate-pulse rounded-md bg-amber-100/70" />
			</div>

			{/* Date skeleton */}
			<div className="mt-4 h-3 w-1/3 animate-pulse rounded-md bg-amber-100/70" />
		</div>
	);
}

export function RecentActivitySkeletonList({ limit = 3 }: { limit?: number }) {
	return (
		<div className="flex flex-col gap-6 h-full">
			{Array.from({ length: limit }).map((item, idx) => (
				<RecentActivitySkeleton key={idx} />
			))}
		</div>
	);
}
