import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";
import cors from "cors";
const PORT = process.env.PORT || 5001;

/* const __dirname = path.resolve(); */

dotenv.config();

const corsOptions = {
    origin: '*',
    credential: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.options('*', cors(corsOptions), (req, res) => {
    res.set('Access-Control-Allow-Origin', 'https://c-box.vercel.app');  // Update with your client URL
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200); 
});
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    res.setTimeout(120000, () => { // Set timeout to 2 minutes
        res.status(408).json({ error: 'Request timed out' });
    });
    next();
});
app.use("/auth",cors(corsOptions), authRoutes);
app.use("/messages",cors(corsOptions), messageRoutes);
app.use("/users",cors(corsOptions), userRoutes);

app.get("/", (req, res) => {
    res.send("Hello, this is the root!");
});

/* app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
}); */
connectToMongoDB();
server.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server Running on port ${PORT}`);
});
