import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

// we will produce 2 routes
// 1. Protect routes for logged in user
// 2. ADMIN route for admin users

export const protect = asyncHandler(async (req, res, next) => {
    let token;

    //Read jwt from cookie
    token = req.cookies.jwt;

    if (token) {
        try {
            // extracting userId from payload
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // decoded is now an object which has userId has field
            req.user = await User.findById(decoded.userId).select('-password');
            // now this user object will be on user object everywhere so we can directly access loggein user from here
            next(); // move on to next middleware

        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not authorised, invalid token');
        }
    }
    else {
        res.status(401);
        throw new Error('Not authorised, no token');
    }
});


export const admin = (req, res, next) => {
    if (req.user && (req.user.isAdmin)) {
        next();
    }
    else {
        res.status(401);
        throw new Error('Not authorised as admin');
    }
}