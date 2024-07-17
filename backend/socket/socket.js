import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
const app = express();

const corsOptions = {
    origin: '*',
    credential: true,
    methods: ["GET", "POST", "OPTIONS"],
};


app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["https://c-box.vercel.app"],
		methods: ["GET", "POST","OPTIONS"],
	},
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	const userId = socket.handshake.query.userId;
	if (userId != "undefined") userSocketMap[userId] = socket.id;

	// io.emit() is used to send events to all the connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// socket.on() is used to listen to the events. can be used both on client and server side
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { app, io, server };
