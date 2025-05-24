import { eq } from "drizzle-orm";
import { db } from "~/db/index.server";
import { usersTable, type User } from "~/db/schema";

export async function updateUserTokens(userId: User["id"], token: number = 1) {
    // get user in db first
    const [userInDb] = await db.select().from(usersTable).where(eq(usersTable.userId, userId)).limit(1);

    const potentionalNewTokenValue = userInDb.tokens - token;
    const balanceIsNotEnough = userInDb.tokens === 0 || potentionalNewTokenValue < 0;

    // checking the user has enough balance to perform operation
    if (balanceIsNotEnough) return {
        success: false,
        message: 'Insufficient tokens'
    }

    // update users token
    try {
        await db.update(usersTable).set({ tokens: userInDb.tokens - token }).where(eq(usersTable.userId, userId))
    } catch (e) {
        console.error(`🔴Error updating user tokens`, e)
    }

    // happy path
    return {
        success: true,
        message: "Tokens updated successfully"
    }
}
export async function refundUserToken(userId: User['id'], token: number = 1) {
    const [userInDb] = await db.select().from(usersTable).where(eq(usersTable.userId, userId)).limit(1);
    if (userInDb.tokens < 0) return {
        success: false,
        message: 'Tokens are less than zero, something went wrong'
    }

    try {
        await db.update(usersTable).set({ tokens: userInDb.tokens + token }).where(eq(usersTable.userId, userId))
    } catch (e) {
        console.error(`🔴Error updating user tokens`, e)
    }
    return {
        success: true,
    }
}