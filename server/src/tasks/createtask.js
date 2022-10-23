export async function createTask(categoryId, taskContent) {
    // dynamic import
    const { Task } = await import("../models/task.js")

    // store in db
    let task = await Task.create({
        taskContent,
        categoryId
    })

    // if successful, update category with created task
    if (task) {
        const { Category } = await import("../models/category.js")

        const filter = { _id: categoryId};
        const update = { $push: { tasks: task._id } };

        // Update user category array with newly created category
        await Category.findOneAndUpdate(filter, update, {
            new: true
        })

        // Return id of newly created task
        return task._id;
    }

    // return id of updated task
    return task._id
}