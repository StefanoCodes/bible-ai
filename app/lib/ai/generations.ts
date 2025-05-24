import { generateObject, NoObjectGeneratedError } from 'ai';
import { dailyBibleVerseCookie } from '~/cookie.server';
import { dailyBibleVerseSystemPrompt } from '../data/system/prompts';
import { dailyBibleVerseResponseSchema } from '../zod/generations/daily-bible-verse';
import { storyResponseSchema } from '../zod/generations/simplify-bible-story';
import { simplifyBibleStorySystemPrompt, simplifyBibleVerseSystemPrompt } from './../data/system/prompts';
import { verseResponseSchema } from '../zod/generations/simplify-bible-verse';
import { model } from '../constants';
// daily bible verse
export async function generateDailyBibleVerse(request: Request) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    try {
        // Get the cookie value from the request
        const cookieValue = await dailyBibleVerseCookie.parse(request.headers.get("Cookie") || ""); // Get cookie from headers

        if (cookieValue) {

            const storedDate = new Date(cookieValue.date);

            if (storedDate.getTime() === today.getTime()) {
                // If the stored verse is from today, return it
                console.log('Using stored verse from cookie');
                return cookieValue; // Return the verse object
            }
        }
    } catch (error) {
        console.error('Error parsing cookie or date:', error);
        // Handle the error, possibly by invalidating the cookie
    }


    // Generate a new verse if no verse is stored, or if it's from a previous day
    try {
        const { object } = await generateObject({
            model,
            prompt: "Generate a random and not common Bible verse that offers encouragement.",
            schema: dailyBibleVerseResponseSchema,
            system: dailyBibleVerseSystemPrompt,
            temperature: 0.8
        });

        // Store the verse and the date in the cookie
        const verseToStore = {
            verse: object,
            date: today.toISOString(),
        };

        // Create the cookie header string
        const cookieHeader = await dailyBibleVerseCookie.serialize(verseToStore);

        console.log('Generated and stored new verse');
        return {
            verse: object,
            cookie: cookieHeader,
        };
    } catch (error) {
        console.error('Error generating verse:', error);
        throw error;
    }
}
// tools
export async function generateSimplifiedBibleStory(
    storyName: string,
    audience: string,
) {

    const prompt = `
        Transform the biblical story of "${storyName}" into a version appropriate for ${audience} aged person.
        Include the key events, characters, and lessons while maintaining biblical accuracy.
        Simplify complex theological concepts and use age-appropriate language.
      `;
    try {
        const { object } = await generateObject({
            model,
            prompt,
            schema: storyResponseSchema,
            system: simplifyBibleStorySystemPrompt,
        });
        return { success: true, object };
    } catch (error) {
        if (NoObjectGeneratedError.isInstance(error)) {
            console.log('NoObjectGeneratedError');
            console.log('Cause:', error.cause);
            console.log('Text:', error.text);
            console.log('Response:', error.response);
            console.log('Usage:', error.usage);
            return {
                success: false,
                object: null,
            }
        }
        return {
            success: false,
            object: null,
        }
    }
}
export async function generateSimplifiedBibleVerse(
    feeling: string,
    bibleVerseReference?: string,
) {
    const prompt = `
      The user is feeling: "${feeling}".
      ${bibleVerseReference
            ? `They have provided this verse reference: "${bibleVerseReference}".`
            : ''
        }
      Generate 1-3 Bible verses that are relevant to this feeling, with simplified explanations.
    `;

    try {
        const { object } = await generateObject({
            model,
            prompt,
            schema: verseResponseSchema,
            system: simplifyBibleVerseSystemPrompt,
        });
        console.log(object)
        return { success: true, object };
    } catch (error) {
        if (NoObjectGeneratedError.isInstance(error)) {
            console.error('NoObjectGeneratedError:', error);
            console.error('Cause:', error.cause);
            console.error('Text:', error.text);
            console.error('Response:', error.response);
            console.error('Usage:', error.usage);
            return {
                success: false,
                object: null,
            };
        }
        console.error('Error generating verse:', error);
        return {
            success: false,
            object: null,
        };
    }
}
