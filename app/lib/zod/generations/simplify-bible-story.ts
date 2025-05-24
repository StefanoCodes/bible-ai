import { z } from 'zod';

export const targetAgeGroupsEnum = z.enum(['children', 'teenagers', 'adults'])

export const storyResponseSchema = z.object({
    title: z.string().describe("The title of the simplified story"),
    summary: z.string().describe("A 2-3 sentence summary of the story"),
    mainCharacters: z.array(z.object({
        name: z.string(),
        description: z.string(),
    })).describe("List of main characters in the story"),
    storyContent: z.string().describe("The simplified story content"),
    keyLessons: z.array(z.string()).describe("Key lessons or morals from the story"),
    originalReferences: z.array(z.string()).describe("Biblical references (book, chapter, verses)"),
    visualDescriptions: z.array(z.object({
        scene: z.string(),
        description: z.string(),
    })).describe("Descriptions of key scenes that could be visualized"),
    comprehensionQuestions: z.array(z.string()).describe("questions to test understanding"),
    prayers: z.array(z.string().describe("Create a prayer based on the key lessons of the story, try to make it 3 paragraphs, and make it more spiritual and personal")).describe(" try to generate 3 versions of prayers based on the key lessons")
});
export const storyRequestSchema = z.object({
    title: z.string().describe("The title of the simplified story").min(1, "Title is required"),
    originalReferences: z.string().describe("Biblical references (book, chapter, verses)").optional(),
    ageGroup: targetAgeGroupsEnum,
})


export type StoryRequest = z.infer<typeof storyRequestSchema>;
export type StoryResponse = z.infer<typeof storyResponseSchema>;