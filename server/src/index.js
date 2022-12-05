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
import { deleteCategory } from './categories/deletecategory.js';
import { updateCategory } from './categories/updatecategory.js';
import { createTask } from './tasks/createtask.js';
import { updateTask } from './tasks/updatetask.js';
import { deleteTask } from './tasks/deletetask.js';

// ESM specific features
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();
const PORT = process.env.PORT || 3001;

const buildPath = path.join(__dirname,'../../client/dist')

async function startApp() {
    try {
        app.register(fastifyCookie, {
            secret: process.env.SECRET
        })

        app.register(fastifyStatic, {
            root: buildPath
        })

        app.get('/home', function (req, reply) {
            reply.sendFile('index.html') // serving path.join(__dirname, 'public', 'myHtml.html') directly
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
                    reply.send({
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

                const categories = user?.categories;

                if (categories) {
                    reply.send({
                        data: categories
                    })
                } else {
                    reply.send({
                        data: 'No Categories Found'
                    })
                }

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

        app.put("/api/updatecategory", {}, async (request, reply) => {
            try {
                // get new category id updated taskIds, and original category id from user

                const values = {
                    originalCategoryId: request.body.originalCategoryId,
                    destinationCategoryId: request.body.destinationCategoryId,
                    targetTaskId: request.body.targetTaskId,
                    taskIds: request.body.taskIds
                }
    
                const updatedCategories = await updateCategory(values)

                reply.send({
                    updatedCategories
                })

            } catch (e) {
                console.error(e)
            }
        })

        app.post("/api/createtask", {}, async (request, reply) => {
            try {
                // Get Category id and task content from user input
                const categoryId = request.body.categoryId;
                const taskContent = request.body.taskContent;
                
                if (categoryId != null && taskContent != null) {
                    const createdTask = await createTask(categoryId, taskContent)
                    
                    reply.send({
                        taskId: createdTask
                    })

                }

            } catch (error) {
                console.error(error)
            }
        })

        app.put("/api/updatetask", {}, async (request, reply) => {
            try {
                // get Task Id and completion status from user
                const taskId = request.body.taskId;
                const isCompleted = request.body.isCompleted;
                const taskContent = request.body.taskContent;

                if (taskId != null && isCompleted != null) {
                    const updatedTask = await updateTask(taskId, isCompleted, taskContent)

                    reply.send({
                        updatedTask
                    })
                }
            } catch (e) {
                console.error(e)
            }
        })

        app.delete("/api/deletetask", {}, async (request, reply) => {
            try {
                // Task Id to select task to delete
                const taskId = request.body.taskId;
                // Category Id to remove deleted task from tasks array on Category model
                const categoryId = request.body.categoryId;

                const operation = await deleteTask(taskId, categoryId)

                reply.send({
                    taskId: operation,
                    title: 'Success!',
                    body: `Task with id of ${operation} has been deleted!`
                })

            } catch (error) {
                console.error(error)
            }
        })

        app.delete("/api/deletecategory", {}, async (request, reply) => {
            try {
                const user = await getUserFromCookies(request,reply)
                const userId = user._id;

                const values = {
                    userId,
                    categoryId: request.body.categoryId
                }

                const operation = await deleteCategory(values)

                reply.send({
                    categoryId: operation,
                    title: 'Success!',
                    body: `Category with id of ${operation} has been deleted!`
                })
            } catch (error) {
                console.error(error)
            }
        })

        await app.listen({port: PORT})
        console.log(`🚀 Server Listening at port ${PORT}`)
    } catch (error) {
        console.error(error);
    }
}

connectDb().then( () => {
    startApp();
})