// Import Express
import express from 'express';

// Import Socket.IO Server class
import { Server } from 'socket.io';

// Import HTTP server creator
import { createServer } from 'http';
// If we have to use cors as middleware --- so we can use in api
import cors from 'cors';


// Create Express app
const app = express();

// Create an HTTP server using Express app
const server = createServer(app);

// Server port
const PORT = 5000;

// Create Socket.IO instance and enable CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// When a client connects
io.on("connection", (socket) => {
  console.log("User Connected");
  console.log("Socket ID:", socket.id);

  // // Emit a welcome message to the connected client
  // socket.emit("welcome", "Welcome to the server.");

  // socket.broadcast.emit("welcome", `${socket.id}joined the server.`);

  // Optional: listen for messages from the client
  socket.on("message", (msg) => {
    console.log("Received message from client:", msg);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// As Middleware --- Need when we use API
// app.use(cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },));

// Test route
app.get("/", (req, res) => {
  res.send("Campus Connect Server/Backend Setup Working🚀");
});

// Start HTTP server (IMPORTANT: use server.listen, not app.listen(which creates a new instance))
server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
