import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const generateTokenAndSetCookie = (userId, res) => {
    try {
        // Check if JWT_SECRET is loaded correctly
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables.");
        }

        console.log("JWT_SECRET:", process.env.JWT_SECRET);

        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "15d",
        });

        console.log("Generated token:", token);

        res.cookie("jwt", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
            httpOnly: true, // prevent XSS attacks
            sameSite: "strict", // prevent CSRF attacks
            secure: process.env.NODE_ENV !== "development", // set secure flag based on environment
        });
    } catch (error) {
        console.error("Error generating token:", error.message);
        // Handle error appropriately, e.g., send an error response
    }
};

export default generateTokenAndSetCookie;
