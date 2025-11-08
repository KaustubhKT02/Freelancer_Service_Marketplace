import {Server, Socket} from 'socket.io';
import messages  from '../models/models';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CORS_UR,
            method: ['GET', 'POST']
        },
    });

    // socket connection

    io.on("connection", (Socket)=> {
        console.log("User Connected", Socket.id);
    });

    // Join Personal room 

    Socket.on("joinUser", (userId)=> {
        Socket.join(`user_${userId}`);
        console.log(`USer ${userId} joined room user_${userId}`);
    });

    // Send Message (real-time)
    Socket.on("sendMessage", async(data) => {
        const {sender_id, reciver_id, content, attachment_url } =data;

        const message = await messages.create({
            sender_id,
            reciver_id,
            content,
            attachment_url: attachment_url || null,
            is_read: false
        })

        // Emit to reciever & sender 
    io.to(`user_${reciver_id}`).emit("newMessage", message);
    io.to(`user_${sender_id}`).emit("messageSent", message);

    // Notification event 
    io.to(`user_${reciver_id}`).emit("notification", {
        sender_id,
        message: "New message recieved",
    });
    });

    // Typing Indicator 
    Socket.on("typing", ({sender_id, reciver_id}) => {
        io.to(`user_${reciver_id}`).emit("typing", {sender_id});
        io.to(`user_${sender_id}`).emit("typing", reciver_id);

      Socket.on("stopTyping", ({reciver_id, sender_id})=> {
        io.to(`user_${reciver_id}`).emit("stopTyping", {sender_id});
        io.to(`user_${sender_id}`).emit("stopTyping", reciver_id);
    });


    // Disconnect server

    Socket.on("disconnect", ()=> {
        console.log("user disconnect", Socket.id)
    });
    });
}

export const getIo = () => io;