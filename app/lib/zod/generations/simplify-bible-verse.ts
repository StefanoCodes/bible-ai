import { z } from "zod";

export const verseRequestSchema = z.object({
    feeling: z.string().describe("The name of the feeling the user wants a bible verse related to that").min(1, "Feeling is required"),
    bibleVerseReference: z.string().optional().describe("The reference to a bible verse they want to simplify if they are already know this one is matching their feeling")
})

export const verseResponseSchema = z.object({
    bibleVerses: z.array(z.object({
        reference: z.string().describe("Bible verse reference which co-relates to the feeling the user felt."),
        bibleVerse: z.string().describe("The Bible verse itself that co-relates and/or expresses the feeling the user felt"),
        simplifiedVersionOfBibleVerse: z.string().describe("The Bible verse itself that co-relates and/or expresses the feeling the user felt but simplfied in an easier language to understand"),
    })).max(3).describe("A list of bible verses which each have a reference to the verse, the verse itself and a simplified version of the bible verse"),
    feelings: z.array(z.string().describe("A feeling that the verse expressed")).describe("a list of feelings and/or emotions the bible verse expressed")

})
export type VerseRequest = z.infer<typeof verseRequestSchema>;
export type VerseResponse = z.infer<typeof verseResponseSchema>;