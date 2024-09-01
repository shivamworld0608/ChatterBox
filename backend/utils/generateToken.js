import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const generateTokenAndSetCookie = (userId, res) => {
  const { JWT_SECRET, NODE_ENV } = process.env;

  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables.");
    return;
  }

  try {
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15d" });

    res.cookie("jwt", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
      httpOnly: true,
      sameSite: "None",
      secure: NODE_ENV !== "development", // set secure flag based on environment
    });
  } catch (error) {
    console.error("Error generating token:", error.message);
  }
};

export default generateTokenAndSetCookie;
