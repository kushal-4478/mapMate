import asyncHandler from "../utils/asyncHandler";
import User from "../models/usermodel.js";

import generateToken from "../auth/jwtToken.js";



//REGISTER USER
export const registerUser = asyncHandler(async (req, res) => {
    const { username, password, age, email, gender } = req.body;

    if (!username || !password || !age || !email || !gender) {
        res.status(400);
        throw new Error("Please provide username, password, age, email, gender");
    }

    //email should be unique..
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        username,
        password,
        age,
        email,
        gender,
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            age: user.age,
            gender: user.gender,
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

//LOGIN USER
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Please provide email and password");
    }

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {

        const token = generateToken(user,res);
        res.status(200).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            age: user.age,
            gender: user.gender,
            token,
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

//SIGN OUT USER ONLY IF IT IS LOGGED IN
export const signOutUser = asyncHandler(async (req, res) => {
    if (req.user) {
        req.user = null; // Clear the user session or token
        res.status(200).json({ message: "User signed out successfully" });
    } else {
        res.status(400);
        throw new Error("No user is currently logged in");
    }
});

//GET USER PROFILE WITH ID BY ADMIN ONLY
export const getUserProfileById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!req.user || !req.user.isAdmin) {
        res.status(403);
        throw new Error("Access denied. Admins only.");
    }

    const user = await User.findById(id).select("-password");
    // EXAMPLE USER OBJECT
    // {  
    //     _id: "123",
    //     name: "John Doe",
    //     email: "john@example.com",
    //     password: "hashedpassword123"
    // }

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});