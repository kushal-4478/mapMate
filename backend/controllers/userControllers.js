import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/usermodel.js";

import generateToken from "../auth/jwtToken.js";
import jwt from "jsonwebtoken";

//REGIUSTER USER
// This controller handles user registration by creating a new user in the database
// Controller to handle user registration
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, age, gender } = req.body;

    const user = await User.create({
      username,
      email,
      password,
      age,
      gender,
      location: {
        city: '',
        state: '',
        country: '',
        coordinates: {
          type: 'Point',
          coordinates: [0, 0] // [longitude, latitude]
        }
      },
      preferences: {
        ageRange: {
          min: 18,
          max: 50
        },
        distance: 50,
        interestedIn: 'Both'
      }
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating user'
    });
  }
};

//LOGIN USER

// Controller to handle user login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Changed token payload to use userId instead of id
  const token = jwt.sign(
    { 
      userId: user._id,  // Changed from id to userId
      email: user.email 
    }, 
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    token
  });
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

//GET PROFILE
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select('-password -confirmPassword')
            .lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Fetched user profile:', user); // Debug log
        res.json(user);
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

export const updatePersonalDetails = async (req, res) => {
    try {
        const { occupation, education, languages, bio } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            {
                $set: {
                    'personalDetails.occupation': occupation,
                    'personalDetails.education': education,
                    'personalDetails.languages': languages,
                    'personalDetails.bio': bio
                }
            },
            { new: true, runValidators: true }
        ).select('-password -confirmPassword');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Updated user profile:', updatedUser); // Debug log
        res.json(updatedUser);
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ 
                success: false,
                message: 'Search query is required' 
            });
        }

        // Search users by username or email, excluding the current user
        const users = await User.find({
            $and: [
                { _id: { $ne: req.user.userId } }, // Exclude current user
                {
                    $or: [
                        { username: { $regex: query, $options: 'i' } },
                        { email: { $regex: query, $options: 'i' } }
                    ]
                }
            ]
        }).select('username email _id');

        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching users'
        });
    }
};