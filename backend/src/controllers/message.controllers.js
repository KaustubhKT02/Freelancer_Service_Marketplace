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
  const { reciver_id, content } = req.body;

  if (!reciver_id || !content) {
    throw new apiError(400, "All feild are required");
  }

  // attachment file
  let attachment_url = null;

  if (req.file && req.file.path) {
    const uploadAttachment = await uploadCloudinary(req.file.path);

    if (!uploadAttachment) {
      throw new apiError(500, "Failed to upload profile picture");
    }

    attachment_url = uploadAttachment.url;
  }

  const message = await messages.create({
    sender_id: req.user?.id,
    reciver_id,
    content,
    attachment: attachment_url,
    is_read: false,
  });

  // Notify reciever via socket.io

  const io = getIo();
  if (io) {
    io.to(`user_${reciver_id}`).emit("newMessage", message);
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
        reciver_id: req.user?.id, // TO the logged-in user
        is_read: false,
      },
    }
  );

  if (updatedCount === 0) {
    return res
      .status(200)
      .json(new apiResponse(200, "No unread messages to update"));
  }

  res
    .status(200)
    .json(new apiResponse(200, `${updatedCount} message(s) marked as read`));
});

// get last messages per connversation

const getMessage = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  const message = await messages.findAll({
    where: {
      [Op.or]: [{ sender_id: userId }, { reciver_id: userId }],
    },
    attributes: [
      "id",
      "sender_id",
      "reciver_id",
      "content",
      "attachment",
      "createdAt",
    ],
    order: [["createdAt", "DESC"]],
  });

  const chatMap = new Map();

  message.forEach((msg) => {
    const otherUser = msg.sender_id === userId ? msg.reciver_id : msg.sender_id;
    if (!chatMap.has(otherUser)) {
      chatMap.set(otherUser, msg);
    }
  });

  res.status(200).json(new apiResponse(200, Array.from(chatMap.values())));
});

export { sendMessage, markMessageRead, getMessage };
