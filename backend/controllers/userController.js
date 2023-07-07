import express from 'express';
import asyncHandler from '../middlewares/asyncHandler.js';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc Auth user & getToken
// @route POST/api/users/login
// @access Public
export const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {// password validation

        // // create the token   // info given to payload
        // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        //     expiresIn: '30d',
        // });
        // // we will store token in cookie instead of local storage of brower this will make our application more safer
        // // set JWT as HTTP-Only cookie
        // // name token options
        // res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV !== 'development', sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000 });// because of https  30 days

        // --------------------------------------------------------------------------------

        generateToken(res, user._id);  // new way to generate toke
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });

    }
    else {
        res.status(401);
        throw new Error('Invalid email or password !');
    }
    res.json('auth user');
})


// @desc Auth user & getToken
// @route POST/api/users/
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists !');
    }
    // create/register user
    const user = await User.create({
        name: name,
        email: email,
        password: password,
    });
    if (user) {
        generateToken(res, user._id);



        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    }
    else {
        res.status(400);
        throw new Error('Invalid user data');
    }
})

// @desc Logout user & clear cookie since we will destroy cookie also
// @route POST/api/users/logout
// @access Private
export const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', { // name of cookie , new value, options--->clearing cookie
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out!' })
})

// @ desc Get user profiles
// @ routes GET api/users/profile
// @ access Public
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    }
    else {
        res.status(401);
        throw new Error('User not found');
    }
    res.send('get user profile');
})

// @ desc Upadate user profiles
// @ routes PUT api/users/profile not supplying id becassue we will use cookie which will contain id in it as a payload
// @ access private
export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    }
    else {
        res.status(404);
        throw new Error('User not found !');
    }

    res.send('update user profile');
})


// @ desc Get user profiles
// @ routes PUT GET/users
// @ access private/admin
export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);

})

// @ desc Get user profile
// @ routes PUT GET/users/:id
// @ access private/admin
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.status(200).json(user);
    }
    else {
        res.status(404);
        throw new Error('User not found')
    }
})

// @ desc Delete user by id
// @ routes delete GET/users/:id
// @ access private/admin
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if (user.isAdmin) {
            res.status(400);
            throw new Error('Cannot delete admin user');
        }
        await User.deleteOne({ _id: user._id });
        res.status(200).json({ message: 'User deleted successfully!' });

    }
    else {
        res.status(404);
        throw new Error('User not found')
    }
})

// @ desc PUT user by id
// @ routes put PUT/users/:id
// @ access private/admin
export const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);
        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        });
    }
    else {
        res.status(404);
        throw new Error('User not found')
    }
})



