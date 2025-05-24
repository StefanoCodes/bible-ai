import { createCookie } from "react-router";

export const dailyBibleVerseCookie = createCookie("dailyBibleVerse", {
    maxAge: 86400, // 24 hours in seconds
});
