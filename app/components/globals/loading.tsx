import { BookOpen, Loader2 } from "lucide-react";

export function GlobalPendingUI() {
	return (
		<div className="bg-[#FFF8EE] border h-full w-full border-amber-200 rounded-lg shadow-lg p-8 max-w-md  flex flex-col items-center">
			<div className="relative mb-4">
				<BookOpen className="w-12 h-12 text-amber-800" />
				<div className="absolute inset-0 flex items-center justify-center">
					<Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
				</div>
			</div>
			<h3 className="text-xl font-serif text-amber-900 mb-2">
				Loading Scripture
			</h3>
			<p className="text-amber-800 text-center text-sm mb-4">
				"Your word is a lamp to my feet and a light to my path."
			</p>
			<div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden">
				<div className="bg-amber-600 h-full rounded-full animate-progress"></div>
			</div>
		</div>
	);
}
