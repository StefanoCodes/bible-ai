import { data } from "react-router";
import { generateDailyBibleVerse } from "../ai/generations";
import type { BibleVerseResponse } from "../zod/generations/daily-bible-verse";

export async function dailyBibleVerse(request: Request) {
    try {
        const { verse, cookie } = await generateDailyBibleVerse(request);
        const headers = new Headers();
        if (cookie) {
            headers.append("Set-Cookie", cookie);
        }
        return data(
            { verseData: verse as BibleVerseResponse, headers, });
    } catch (error) {
        console.error("Error in loader:", error);
        return data({
            verseData: {
                verse: "",
                bibleVerseReference: "",
                keyTakeaways: [""],
            },
            headers: undefined,
        }, {
            status: 403
        })
    }
}