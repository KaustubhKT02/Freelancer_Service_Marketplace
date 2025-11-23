import { notification } from "../models/models.js";

let ioInstance = null;

export const initNotificationSocket = (io) => {
  ioInstance = io;
};

export const sendNotification = async (
  userId,
  title,
  message,
  type = "system"
) => {
  try {
    const notify = await notification.create({
      user_id: userId,
      title,
      message,
      type,
    });

    if (ioInstance) {
      ioInstance.to(`user_${userId}`).emit("notification", notify);
    }

    return notify;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};
