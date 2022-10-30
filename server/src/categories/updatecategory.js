export async function updateCategory ({
  originalCategoryId,
  destinationCategoryId,
  targetTaskId,
  taskIds
}) {
  // dynamic import
  const { Category } = await import('../models/category.js')
  const { Task } = await import('../models/task.js')

  if (originalCategoryId !== destinationCategoryId) {
    //   update original container by pulling out target task id from original category
    const originalFilter = { _id: originalCategoryId }
    const originalUpdate = { $pull: { tasks: targetTaskId } }

    let updatedOriginalCategory = await Category.findOneAndUpdate(
      originalFilter,
      originalUpdate,
      {
        new: true
      }
    )

    // Update destination container with new array of task ids
    const destinationFilter = { _id: destinationCategoryId }
    const destinationUpdate = { $set: { tasks: taskIds } }

    let updatedDestinationCategory = await Category.findOneAndUpdate(
      destinationFilter,
      destinationUpdate,
      {
        new: true
      }
    )

    // update task with categoryId of destination category
    const taskFilter = { _id: targetTaskId }
    const taskUpdate = { categoryId: destinationCategoryId };

    let updatedTask = await Task.findOneAndUpdate(
      taskFilter,
      taskUpdate,
      {
        new: true
      }
    )

    return {
      updatedOriginalCategory,
      updatedDestinationCategory,
      updatedTask
    }
  } else {
    // originalCategoryId, taskIds
    const filter = { _id: originalCategoryId }
    const update = { $set: { tasks: taskIds } }

    let updatedCategory = await Category.findOneAndUpdate(filter, update, {
      new: true
    })
    return updatedCategory;
  }
}
