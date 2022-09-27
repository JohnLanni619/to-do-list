import { randomBytes } from 'crypto';

export async function createSession(userId, connection) {
    try {
        // Generate a session token
        const sessionToken = randomBytes(43).toString('hex');
        // Retrieve connection information
        const { ip, userAgent } = connection
        // insert into database
        const { Session } = await import("../models/session.js")

        await Session.create({
            sessionToken,
            userId: userId,
            valid: true,
            userAgent,
            ip
        })
        // Return session token
        return sessionToken
    } catch (error) {
        throw new Error('Session Creation Failed')
    }
}