import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

// Initialize Socket.io with auto-fallback to polling enabled
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Standard Vite port
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${socket.id}. Reason: ${reason}`);
  });
});

// Helper function to broadcast new threat alerts across E-vara
export const broadcastThreatAlert = (alertData) => {
  io.emit("threat-alert", alertData);
};

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
