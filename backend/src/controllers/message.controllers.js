import { messages } from "../models/models.js";
import { getIo } from "../config/socket.config.js";
import {
  apiError,
  apiResponse,
  asyncHandler,
  uploadCloudinary,
} from "../utils/utils.js";
import { Op } from "sequelize";

//  Send Message (HTTP version)

const sendMessage = asyncHandler(async (req, res) => {
  const { receiver_id, content } = req.body;

  if (!receiver_id || !content) {
    throw new apiError(400, "All feild are required");
  }

  // Prevent sending message to self
  if (receiver_id == req.user.id) {
    throw new apiError(400, "You cannot send message to yourself");
  }

  // attachment file
  let attachment_url = null;
  if (req.file?.path) {
    const uploadAttachment = await uploadCloudinary(req.file.path);
    if (!uploadAttachment) {
      throw new apiError(500, "Failed to upload attachment");
    }
    attachment_url = uploadAttachment.url;
  }

  const message = await messages.create({
    sender_id: req.user.id,
    receiver_id,
    content,
    attachment: attachment_url || null,
    is_read: false,
  });

  // Notify reciever via socket.io

  const io = getIo();
  if (io) {
    io.to(`user_${receiver_id}`).emit("newMessage", message);
    io.to(`user_${req.user.id}`).emit("messageSent", message);
  }

  return res
    .status(201)
    .json(new apiResponse(201, message, "Message sent successfully"));
});

// Mark messages as read
const markMessageRead = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new apiError(400, "User ID is required");
  }

  const [updatedCount] = await messages.update(
    { is_read: true },
    {
      where: {
        sender_id: userId, // messages FROM the other user
        receiver_id: req.user?.id, // TO the logged-in user
        is_read: false,
      },
    }
  );

  res
    .status(200)
    .json(new apiResponse(200, {updated: updatedCount}, `${updatedCount} message(s) marked as read`));
});

// get last messages per connversation

const getMessage = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const message = await messages.findAll({
    where: {
      [Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
    },
    attributes: [
      "id",
      "sender_id",
      "receiver_id",
      "content",
      "attachment",
      "createdAt",
      "is_read",
    ],
    order: [["createdAt", "DESC"]],
  });

  const chatMap = new Map();

  message.forEach((msg) => {
    const otherUser = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
    if (!chatMap.has(otherUser)) {
      chatMap.set(otherUser, msg);
    }
  });

  res.status(200).json(new apiResponse(200, Array.from(chatMap.values())));
});

export { sendMessage, markMessageRead, getMessage };
