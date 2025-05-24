import { storyRequestSchema } from "./simplify-bible-story";
import { verseRequestSchema } from "./simplify-bible-verse";
// add more tools and their relevant schemas for the dynamic dialog to work well with the zod schema
export const GenerationsSchemas = {
    "simplify-bible-story": storyRequestSchema,
    "simplify-bible-verse": verseRequestSchema,
}