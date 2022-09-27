import bcrypt from "bcryptjs";
const { genSalt, hash } = bcrypt;

export async function registerUser(email, password) {
    // dynamic import
    const { User } = await import("../models/user.js")
    // generate the salt
    const salt = await genSalt(10);
    // hash with salt
    const hashedPassword = await hash(password, salt);

    // store in db
    let user = await User.create({
        email: {
            address: email,
            verified: false
        },
        password: hashedPassword
    })

    // return user from db
    return user._id
}