import "dotenv/config";
import cors from 'cors';
import express from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";

// Import routes
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profiles.js";
import playmatesRoutes from "./routes/playmates.js";
import messagesRoutes from "./routes/messages.js";
import settingsRoutes from "./routes/settings.js";
import dogProfilesRoutes from "./routes/dogProfiles.js";
import notificationsRoutes from "./routes/notifications.js";
import mutualLikeRoutes from "./routes/mutualLike.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 8080;

// Middleware - CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true, 
}));

// Middleware - parse JSON
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/profiles", profileRoutes);
app.use("/playmates", playmatesRoutes);
app.use("/messages", messagesRoutes);
app.use("/settings", settingsRoutes);
app.use("/dog_profiles", dogProfilesRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/mutuallike", mutualLikeRoutes);

// Websocket connection
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (data) => {
    const message = JSON.parse(data);
    console.log("Received message:", message)

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        console.log("Broadcasting message:", message); 
        client.send(JSON.stringify(message));
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
