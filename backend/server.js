import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";   
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

const PORT = process.env.PORT || 5001; 

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

connectToMongoDB();

app.use("/auth",cors(corsOptions), authRoutes);
app.use("/messages",cors(corsOptions), messageRoutes);
app.use("/users",cors(corsOptions), userRoutes);

app.get("/", (req, res) => {
    res.send("Hello, this is the root!");
});

server.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server Running on port ${PORT}`);
});
