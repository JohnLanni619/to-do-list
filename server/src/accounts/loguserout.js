import jwt from 'jsonwebtoken'

export async function logUserOut(request, reply) {
    try {
        const { Session } = await import("../models/session.js")
        
        if (request?.cookies?.refreshToken) {
            const { refreshToken } = request.cookies
            // Decode refresh token
            const { sessionToken } = jwt.verify(refreshToken,process.env.JWT_SIGNATURE)
            // Delete session from database
            const currentSession = await Session.deleteOne({sessionToken})
        }
        // Remove Cookies
        reply.clearCookie('refreshToken').clearCookie('accessToken')
        
    } catch (error) {
        console.error(error)
    }
}