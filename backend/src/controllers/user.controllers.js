import { asyncHandler } from "../utils/asyncHandler.utils.js";
import users from "../models/users.models.js";
import { apiError } from "../utils/apiError.utils.js";
import uploadCloudinary from "../utils/coludinary.utils.js";
import { apiResponse } from "../utils/apiResponse.utils.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password, role, bio } = req.body;

  // Validate required fields
  if (
    [name, username, email, password, role].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new apiError(400, "All fields are required", s);
  }

  // Check if user already exists
  const existedUser = users.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new apiError(409, "User with this email or username already exists");
  }

  const profilePicture = req.files?.profilePicture[0]?.path; // Access the uploaded file path
  if (!profilePicture) {
    throw new apiError(400, "Profile picture is required");
  }

  const Profile = await uploadCloudinary(profilePicture); // Upload to Cloudinary
  if (!Profile) {
    throw new apiError(500, "Failed to upload profile picture");
  }

  //    Create new user
  const newUser = await users.create({
    name,
    username: username.toLowerCase(),
    email,
    password,
    role,
    bio,
    Profile: Profile.url, // Store the Cloudinary URL
  });

  // Return created user data without password and refreshToken
  const createdUser = await users
    .findByPk(newUser.id)
    .select("-password, -refreshToken");

  if (!createdUser) {
    throw new apiError(500, "User registration failed");
  }

  return res
    .status(201)
    .json(new apiResponse(201, createdUser, "user registered successfully"));
});

export { registerUser };
