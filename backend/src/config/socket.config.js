import { Server } from 'socket.io';
import { messages } from '../models/models.js';
import dotenv from 'dotenv';

dotenv.config();

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_URL, // ✅ make sure it's spelled correctly
      methods: ["GET", "POST"],
    },
  });

  // ✅ All socket logic goes inside here
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // Join personal room
    socket.on("joinUser", (userId) => {
      socket.join(`user_${userId}`);
      console.log(`👤 User ${userId} joined room user_${userId}`);
    });

    // Send Message (real-time)
    socket.on("sendMessage", async (data) => {
      try {
        const { sender_id, reciver_id, content, attachment_url } = data;

        const message = await messages.create({
          sender_id,
          reciver_id,
          content,
          attachment_url: attachment_url || null,
          is_read: false,
        });

        // Emit to receiver & sender
        io.to(`user_${reciver_id}`).emit("newMessage", message);
        io.to(`user_${sender_id}`).emit("messageSent", message);

        // Notification event
        io.to(`user_${reciver_id}`).emit("notification", {
          sender_id,
          message: "New message received",
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    // Typing Indicator
    socket.on("typing", ({ sender_id, reciver_id }) => {
      io.to(`user_${reciver_id}`).emit("typing", { sender_id });
    });

    socket.on("stopTyping", ({ reciver_id, sender_id }) => {
      io.to(`user_${reciver_id}`).emit("stopTyping", { sender_id });
    });

    // Disconnect event
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIo = () => io;