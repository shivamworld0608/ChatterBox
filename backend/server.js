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
    res.sendStatus(200); 
});
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",cors(corsOptions), authRoutes);
app.use("/api/messages",cors(corsOptions), messageRoutes);
app.use("/api/users",cors(corsOptions), userRoutes);

app.get("/", (req, res) => {
    res.send("Hello, this is the root!");
});

/* app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
}); */

server.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server Running on port ${PORT}`);
});
