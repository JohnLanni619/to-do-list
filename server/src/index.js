import './env.js';
import { fastify } from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCookie from '@fastify/cookie';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDb } from './db.js';
import { registerUser } from './accounts/register.js';
import { authorizeUser } from './accounts/authorize.js';
import { logUserIn } from './accounts/loguserin.js';
import { logUserOut } from './accounts/loguserout.js';
import { getUserFromCookies } from './accounts/user.js';

// ESM specific features
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();

async function startApp() {
    try {
        app.register(fastifyCookie, {
            secret: 'kaskdl;asdpkokopqwdko;qwdkl;asd'
        })

        app.register(fastifyStatic, {
            root: path.join(__dirname, "public")
        })

        app.post("/api/register", {}, async (request, reply) => {
            try {
                const userId = await registerUser(request.body.email, request.body.password)

                if (userId) {
                    await logUserIn(userId, request, reply)
                    reply.send({
                        data: {
                            status: "SUCCESS",
                            userId
                        }
                    })
                }
            } catch (error) {
                console.error(error)
                reply.send({
                    data: {
                        status: "FAILED",
                        userId
                    }
                })
            }
        })

        app.post("/api/authorize", {}, async (request, reply) => {
            try {
                const {isAuthorized, userId} = await authorizeUser(request.body.email, request.body.password)
                if (isAuthorized) {
                    await logUserIn(userId, request, reply)
                    reply.send({
                        data: {
                            status: "SUCCESS",
                            userId
                        }
                    })
                } else {
                    reply.send({
                        data: "Auth Failed"
                    })
                }
                
            } catch (error) {
                console.error(error);
            }
        })

        app.post("/api/logout", {}, async (request,reply) => {
            try {
                await logUserOut(request, reply)
                reply.send({
                    data: {
                        status: "SUCCESS"
                    }
                })
            } catch (error) {
                console.error(error)
                reply.send({
                    data: {
                        status: "FAILED"
                    }
                })
            }
        })

        app.get("/test", {}, async (request, reply) => {
            try {
                // Verify user login
                const user = await getUserFromCookies(request,reply)
                // Return user email if it exists, otherwise return unauthorized

                if (user?._id) {
                    reply.send({
                        data: user
                    })
                } else {
                    reply.send({
                        data: 'Failed User Lookup'
                    })
                }
                    
            } catch (error) {
                throw new Error(error)
            }
            
        })

        await app.listen({port: 3000})
        console.log(`🚀 Server Listening at port 3000`)
    } catch (error) {
        console.error(error);
    }
}

connectDb().then( () => {
    startApp();
})