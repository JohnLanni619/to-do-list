export async function deleteTask (taskId, categoryId) {
  // import models
  const { Task } = await import('../models/task.js')
  
  let task = await Task.findById(taskId)
  await task.remove()
  
  if (task) {
    const { Category } = await import('../models/category.js')
    const filter = { _id: categoryId }
    const update = { $pull: { tasks: taskId } };

    // `doc` is the document _after_ `update` was applied because of
    // `new: true`
    await Category.findOneAndUpdate(filter, update, {
        new: true
    })

    return task._id;
  }
}
