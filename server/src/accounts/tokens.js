import jwt from "jsonwebtoken";

const JWTSignature = process.env.JWT_SIGNATURE

export async function createTokens(sessionToken, userId) {
    try {
        // Create Refresh Token
        const refreshToken = jwt.sign({
            sessionToken
        }, JWTSignature)
        // Create Access Token
        const accessToken = jwt.sign({
            sessionToken,
            userId
        }, JWTSignature)
        // Return Refresh Token & Access Token
        return {refreshToken, accessToken}
    } catch (error) {
        console.error(error)
    }
}