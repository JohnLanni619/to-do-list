export async function createCategory({userId, userInput}) {
    // dynamic import
    const { Category } = await import("../models/category.js")

    // store in db
    let category = await Category.create({
        categoryName: userInput,
        userId
    })

    // if successful, update user with created category
    if (category) {
        const { User } = await import("../models/user.js")

        const filter = { _id: userId};
        const update = { categories: category._id };

        let updatedUserCategory = await User.findOneAndUpdate(filter, update, {
            new: true
        })
        
        return updatedUserCategory;
    }

    // return id of updated category
    return category._id
}