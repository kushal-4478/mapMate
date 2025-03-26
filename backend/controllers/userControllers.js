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
            accessToken,
            refreshToken,
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

//SIGN OUT USER ONLY IF IT IS LOGGED IN
export const signOutUser = asyncHandler(async (req, res) => {
    if (req.cookies.refreshToken || req.cookies.accessToken) {
        // Clear both tokens
        res.cookie("accessToken", "", {
            httpOnly: true,
            expires: new Date(0),
        });

        res.cookie("refreshToken", "", {
            httpOnly: true,
            expires: new Date(0),
        });

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

//REFRESH TOKEN ENDPOINT
// REFRESH TOKEN GENERATE THE ACCESS TOKEN
//REFRESH THE ACCESS TOKEN
export const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        res.status(401);
        throw new Error("Refresh token not found, please log in again");
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET || "refreshSecretKey"
        );

        // Find the user associated with the refresh token
        const user = await User.findById(decoded.id);

        if (!user) {
            res.status(401);
            throw new Error("User not found, please log in again");
        }

        // Generate a new access token
        const secretKey = process.env.JWT_SECRET || "hsghvsgsjash872337%^%^$Ehuw";
        const accessTokenExpiresIn = "15m"; // Access token expires in 15 minutes

        const newAccessToken = jwt.sign(
            { id: user.id, email: user.email },
            secretKey,
            { expiresIn: accessTokenExpiresIn }
        );

        // Set the new access token in a cookie
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
        });

        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(401);
        throw new Error("Invalid refresh token, please log in again");
    }
});