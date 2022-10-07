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
import { createCategory } from './categories/createcategory.js';

// ESM specific features
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();

const buildPath = path.join(__dirname,'../../client/build')

async function startApp() {
    try {
        app.register(fastifyCookie, {
            secret: 'kaskdl;asdpkokopqwdko;qwdkl;asd'
        })

        // app.register(fastifyStatic, {
        //     root: buildPath
        // })

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
            }
        })

        app.post("/api/authorize", {}, async (request, reply) => {
            try {
                const {isAuthorized, userId} = await authorizeUser(request.body.email, request.body.password)

                if (isAuthorized) {
                    await logUserIn(userId, request, reply)
                    reply.redirect('/').send({
                        data: {
                            status: "SUCCESS",
                            userId
                        }
                    })
                } else {
                    reply.code(400).send({
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

        app.get("/api/getuser", {}, async (request, reply) => {
            try {
                // Verify user login
                const user = await getUserFromCookies(request,reply)
                // Return user email if it exists, otherwise return unauthorized

                if (user?._id) {
                    reply.send({
                        data: user
                    })
                } else {
                    reply.code(400).send({
                        data: 'Failed User Lookup'
                    })
                }
                    
            } catch (error) {
                throw new Error(error)
            }
        })

        app.get("/api/getcategories", {}, async (request, reply) => {
            try {
                // get userId from cookies
                const user = await getUserFromCookies(request,reply)

                const categories = user.categories;
                console.log(categories)

                if (categories) {
                    reply.send({
                        data: categories
                    })
                } else {
                    reply.send({
                        data: 'No Categories Found'
                    })
                }
                // find user by id, and return users categories
            } catch (error) {
                console.error(error)
            }
        })

        app.post("/api/category", {}, async (request, reply) => {
            try {
                // Get Category name from user input
                const userInput = request.body.userInput
                
                // Get user ID from cookies
                const user = await getUserFromCookies(request,reply)
                const userId = user._id;

                const values = {
                    userId,
                    userInput
                }
                console.log(values)
                
                if (userInput && userId) {
                    const createdCategory = await createCategory(values)
                    
                    reply.send({
                        _id: createdCategory,
                        categoryName: values.userInput
                    })
                }

            } catch (error) {
                console.error(error)
            }
        })

        await app.listen({port: 3001})
        console.log(`🚀 Server Listening at port 3001`)
    } catch (error) {
        console.error(error);
    }
}

connectDb().then( () => {
    startApp();
})