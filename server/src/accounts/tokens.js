import jwt from "jsonwebtoken";

export async function createTokens(sessionToken, userId) {
    try {
        // Create Refresh Token
        const refreshToken = jwt.sign({
            sessionToken
        }, process.env.JWT_SIGNATURE)
        // Create Access Token
        const accessToken = jwt.sign({
            sessionToken,
            userId
        }, process.env.JWT_SIGNATURE)
        // Return Refresh Token & Access Token
        return {refreshToken, accessToken}
    } catch (error) {
        console.error(error)
    }
}