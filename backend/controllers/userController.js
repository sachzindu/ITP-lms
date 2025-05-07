import User from '../models/userModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

// Controller to create a new user
const createUser = asyncHandler(async (req, res) => {
    // Destructure necessary fields from the request body
    const { username, email, alStream, alYear, password } = req.body;

    // Check if required fields are provided
    if (!username || !email || !password) {
        throw new Error("Please fill all the inputs.");
    }

    // Check if user with the given email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).send("User already exists.");
        return; // Ensure we stop execution here after sending a response
    }

    // Hash the password before saving the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser = new User({ username, email, alStream, alYear, password: hashedPassword });

    try {
        // Save the user to the database
        await newUser.save();

        // Generate token and send it in response
        createToken(res, newUser._id);

        // Respond with the user data (excluding sensitive data like password)
        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            profilePicture: newUser.profilePicture,
        });
    } catch (error) {
        // If error occurs during saving, respond with an error message
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// Controller to handle user login
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const existingUser = await User.findOne({ email });

    // Check if user exists and validate password
    if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
        res.status(401);
        throw new Error("Invalid email or password"); // Respond with unauthorized if credentials are incorrect
    }

    // Generate token after successful login
    createToken(res, existingUser._id);

    // Send the user data as response (excluding password)
    res.status(200).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
        profilePicture: existingUser.profilePicture,
    });
});

// Controller to handle user logout
const logoutCurrentUser = asyncHandler(async (req, res) => {
    // Clear the JWT cookie to log the user out
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    // Send a success message as response
    res.status(200).json({ message: "Logged out successfully" });
});

// Controller to fetch all users (for admin use)
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users); // Send all users in the response
});

// Controller to fetch the current user's profile
const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id); // Find user by the authenticated user ID

    if (user) {
        // Send the user's profile data in the response
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
        });
    } else {
        // If user is not found, respond with a 404 error
        res.status(404).json({ message: "User not found" });
    }
});

// Controller to update the current user's profile
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id); // Find user by authenticated user ID

    if (user) {
        // Update user fields based on the request body
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.profilePicture = req.body.profilePicture || user.profilePicture;

        // If password is provided, hash it and update the password
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            user.password = hashedPassword;
        }

        // Save the updated user data
        const updatedUser = await user.save();

        // Send the updated user data as response
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            profilePicture: updatedUser.profilePicture,
        });
    } else {
        // If user is not found, respond with a 404 error
        res.status(404);
        throw new Error("User not found");
    }
});

// Controller to delete a user by ID (for admin use)
const deleteUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id); // Find user by ID

    if (user) {
        // Prevent deletion of admin users
        if (user.role === "admin") {
            res.status(400);
            throw new Error("You can't delete an admin");
        }

        // Delete the user from the database
        await user.deleteOne();

        // Send a success message as response
        res.json({ message: "User deleted successfully" });
    } else {
        // If user is not found, respond with a 404 error
        res.status(404);
        throw new Error("User not found.");
    }
});

// Controller to fetch a user by ID (for admin use)
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password"); // Find user by ID and exclude password

    if (user) {
        // Send the user data as response
        res.json(user);
    } else {
        // If user is not found, respond with a 404 error
        res.status(404);
        throw new Error("User not found");
    }
});

// Controller to update a user by ID (for admin use)
const updateUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id); // Find user by ID

    if (user) {
        // Update user fields based on the request body
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.profilePicture = req.body.profilePicture || user.profilePicture;

        // Save the updated user data
        const updatedUser = await user.save();

        // Send the updated user data as response
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            profilePicture: updatedUser.profilePicture,
        });
    } else {
        // If user is not found, respond with a 404 error
        res.status(404);
        throw new Error("User not found.");
    }
});

export { 
    createUser,
    loginUser,
    logoutCurrentUser,
    getAllUsers,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    deleteUserById,
    getUserById,
    updateUserById,
};
