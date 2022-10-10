export async function deleteCategory({userId, categoryId}) {
    // dynamic import
    const { Category } = await import("../models/category.js")

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