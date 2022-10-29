export async function deleteCategory({userId, categoryId}) {
    // dynamic import
    const { Category } = await import("../models/category.js")
    const { Task } = await import("../models/task.js");

    let deletedTasks = await Task.deleteMany({ categoryId }); // returns {deletedCount: x} where x is the number of documents deleted.
    console.log(deletedTasks);
    // remove from db
    let category = await Category.deleteOne({
        _id: categoryId
    })

    // if successful, remove category from user too
    if (category) {
        const { User } = await import("../models/user.js")

        const filter = { _id: userId};
        const update = { $pull: { categories: categoryId } };

        await User.findOneAndUpdate(filter, update, {
            new: true
        })

        // Return id of deleted category
        return categoryId;
    }
}