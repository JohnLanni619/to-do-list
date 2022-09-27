import pkg from 'bcryptjs';
const { compare } = pkg;

export async function authorizeUser(email, password) {
    // Import user collection
    const { user } = await import("../user/user.js")
    // look up user
    const userData = await user.findOne({
        'email.address': email
    })

    // Get user password
    const savedPassword = userData.password;
    // Compare password that user inputted, with the one in the db
    const isAuthorized = await compare(password, savedPassword)

    // Return boolean of if password is correct

    return {isAuthorized, userId: userData._id}

}
