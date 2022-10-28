export async function updateTask (taskId, isCompleted) {
  // dynamic import
  const { Task } = await import('../models/task.js')

  const filter = { _id: taskId }
  const update = { isCompleted }

  // `doc` is the document _after_ `update` was applied because of
  // `new: true`
  let task = await Task.findOneAndUpdate(filter, update, {
    new: true
  })
  
  return task;
}
