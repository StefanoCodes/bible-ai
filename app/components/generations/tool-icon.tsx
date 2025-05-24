import { BookOpen, Quote } from "lucide-react";

export const getToolIcon = (intent: string) => {
	switch (intent) {
		case "simplify-bible-story":
			return <BookOpen className="h-5 w-5 text-amber-700" />;
		case "simplify-bible-verse":
			return <Quote className="h-5 w-5 text-amber-700" />;
		default:
			return <BookOpen className="h-5 w-5 text-amber-700" />;
	}
};
