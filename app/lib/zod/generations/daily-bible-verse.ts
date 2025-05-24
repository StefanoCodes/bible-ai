import { z } from 'zod';
export const dailyBibleVerseResponseSchema = z.object({
    verse: z.string().describe("random bible verse"),
    bibleVerseReference: z.string().describe("the reference of where the bible verse came from in the bible eg: ephisians 3:20"),
    keyTakeaways: z.array(z.string().describe("a key takeway from the bible verse")).max(3).describe("a list of key takeaways from the bible verse").min(1)
})

export type BibleVerseResponse = z.infer<typeof dailyBibleVerseResponseSchema>;