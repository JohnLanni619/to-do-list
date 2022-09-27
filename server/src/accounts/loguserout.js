import jwt from 'jsonwebtoken'

const JWTSignature = 'masjdpcpjsioadyunasidonhas'

export async function logUserOut(request, reply) {
    try {
        const { session } = await import("../session/session.js")
        
        if (request?.cookies?.refreshToken) {
            const { refreshToken } = request.cookies
            // Decode refresh token
            const { sessionToken } = jwt.verify(refreshToken,JWTSignature)
            // Delete session from database
            const currentSession = await session.deleteOne({sessionToken})
        }
        // Remove Cookies
        reply.clearCookie('refreshToken').clearCookie('accessToken')
        
    } catch (error) {
        console.error(error)
    }
}