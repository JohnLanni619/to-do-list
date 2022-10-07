import jwt from "jsonwebtoken"
import { createTokens } from './tokens.js'

const JWTSignature = 'masjdpcpjsioadyunasidonhas'

export async function getUserFromCookies(request,reply) {
    try {
        const { User } = await import("../models/user.js")
        const { Session } = await import("../models/session.js")
        // Category model needs to be included here for populate method to work
        const { Category } = await import("../models/category.js")
        // Check to make sure access token exists
        // If access token exists, run this if statement and return the user
        if (request?.cookies?.accessToken) {
            // Check if user has an access token

            const { accessToken } = request.cookies
            // Decode access token
            const decodedAccessToken = jwt.verify(accessToken, JWTSignature)
            // Return user from record
            return User.findOne({
                _id: decodedAccessToken?.userId
            }).populate('categories')
        }

        // If access token does NOT exist, but refreshToken does, run this code block
        if (request?.cookies?.refreshToken) {
            const { refreshToken } = request.cookies
            // Decode refresh token
            const { sessionToken } = jwt.verify(refreshToken,JWTSignature)
            // Look up session
            const currentSession = await Session.findOne({sessionToken})

            // Confirm session is valid
            if (currentSession.valid) {
                // Look up current user
                const currentUser = await User.findOne({
                    _id: currentSession.userId
                })

                // refresh tokens
                await refreshTokens(sessionToken, currentUser._id, reply)
                return currentUser
            }
        }

    } catch (error) {
        console.error(error)
    }
}

export async function refreshTokens(sessionToken, userId, reply) {
    try {
        // Create JWT
        const { accessToken, refreshToken } = await createTokens(sessionToken, userId)
        // Set Cookie
        const now = new Date()
        const refreshExpires = now.setDate(now.getDate() + 30)
        reply.setCookie('refreshToken', refreshToken, {
            path: "/",
            domain: "localhost",
            httpOnly: true,
            expires: refreshExpires
        })
        .setCookie('accessToken',accessToken, {
            path: "/",
            domain: "localhost",
            httpOnly: true
        })
    } catch (error) {
        console.error(error)
    }
}