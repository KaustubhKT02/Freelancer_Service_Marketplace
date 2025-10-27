import { asyncHandler } from "../utils/asyncHandler.utils.js";
import users from "../models/users.models.js";
import { apiError } from "../utils/apiError.utils.js";
import {uploadCloudinary} from "../utils/coludinary.utils.js";
import { apiResponse } from "../utils/apiResponse.utils.js";
import { Op } from 'sequelize';
import path from "path";


const registerUser = asyncHandler(async (req, res) => {
  const { fullname, username, email, password, role, bio } = req.body;

  // Validate required fields
  if (
    [fullname, username, email, password, role].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new apiError(400, "All fields are required");
  }

  // Check if user already exists
  const existedUser = await users.findOne({
    where: {
       [ Op.or]: [{ email }, { username }],
    }
  });

  if (existedUser) {
    throw new apiError(409, "User with this email or username already exists");
  }

  const profilePicture = req.file?.path; // Access the uploaded file path
  if (!profilePicture) {
    throw new apiError(400, "Profile picture is required");
  }

  const Profile = await uploadCloudinary(profilePicture); // Upload to Cloudinary
  if (!Profile) {
    throw new apiError(500, "Failed to upload profile picture");
  }

  //    Create new user
  const newUser = await users.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    role,
    bio,
    avatar: Profile.url, // Store the Cloudinary URL
  });

  const createUser  = await users.findByPk(newUser.id)
  if(!createUser) {
    throw new apiError(500, "User registration failed")
  }


  return res
    .status(201)
    .json(new apiResponse(201, createUser,  "user registered successfully"));
});

export { registerUser };
