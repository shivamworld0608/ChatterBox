import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const corsOptions = {
  origin: "https://c-box.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://c-box.vercel.app",
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  },
});

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected with socket ID:", socket.id);

  const userId = socket.handshake.query.userId;

  if (!userId || userId === "undefined") {
    console.warn("Invalid user ID received:", userId);
    socket.disconnect(true); // Disconnect the socket if the userId is invalid
    return;
  }

  userSocketMap[userId] = socket.id;
  console.log(`User ${userId} connected with socket ID: ${socket.id}`);

  // Emit the list of online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`User ${userId} disconnected with socket ID: ${socket.id}`);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // Additional error handling for connection errors
  socket.on("connect_error", (err) => {
    console.error("Connection error:", err.message);
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err.message);
  });
});

export { app, io, server };
