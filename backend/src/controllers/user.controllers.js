import users from '../models/users.models.js';
import {apiError, apiResponse, asyncHandler, uploadCloudinary} from '../utils/utils.js'
import { Op } from 'sequelize';
import JWT from 'jsonwebtoken';


const generateTokenAndRefreshToken = async (userId) => {
  try {
    const user = await users.scope("withSensitive").findByPk(userId);
    if (!user) {
      throw new apiError(404, "User not found");
    }

    // get user access
    const accessToken = user.generateToken();
    const refreshToken = user.generateRefreshToken();

    // save refreshToken in DB
    user.refreshToken = refreshToken;
    await user.save({ validate: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "Somthing went wrong while genrating referesh and access token"
    );
  }
};

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
      [Op.or]: [{ email }, { username }],
    },
  });

  if (existedUser) {
    throw new apiError(409, "User with this email or username already exists");
  }

//  Profile picture 
  let profileUrl = null;

  if (req.file?.path) {
    const uploadedImage = await uploadCloudinary(req.file.path);
    if (!uploadedImage) {
      throw new apiError(500, "Failed to upload profile picture");
    }
    profileUrl = uploadedImage.url;
  }

  //    Create new user
  const newUser = await users.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    role,
    bio,
    avatar: profileUrl || null, // Store the Cloudinary URL
  });

  const createUser = await users.findByPk(newUser.id);
  if (!createUser) {
    throw new apiError(500, "User registration failed");
  }

  return res
    .status(201)
    .json(new apiResponse(201, createUser, "user registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(username || email)) {
    throw new apiError(400, "username or email is required");
  }

  // add filter to push username
  const filter = [];
  if (username) filter.push({ username });
  if (email) filter.push({ email });

  const user = await users.scope("withSensitive").findOne({
    where: {
      [Op.or]: filter,
    },
  });

  if (!user) {
   throw new apiError(404, "User does not exitst");
  }

  const isPasswordVaild = await user.comparePassword(password);

  if (!isPasswordVaild) {
    throw  new apiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateTokenAndRefreshToken(
    user.id
  );

  const loginUser = await users.findByPk(user.id, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loginUser,
          accessToken,
          refreshToken,
        },
        "USer logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const [update] = await users.update(
    { refreshToken: null },
    { where: { id: req.user.id } }
  );

  if (!update) {
    throw apiError(401, "User Not Found");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new apiError(401, "unauthorized request");
  }

  try {
    const verifyToken = JWT.verify(
      incomingRefreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await users.scope("withSensitive").findByPk(verifyToken?.id);

    if (!user) {
      throw new apiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new apiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateTokenAndRefreshToken(
      user.id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new apiResponse(200, "Access token refreshed"));
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid Token");
  }
});

const changeCurrentPAssword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await users.scope('withSensitive').findByPk(req.user.id);
  const isPasswordcorrect = await user.comparePassword(oldPassword);

  if (!isPasswordcorrect) {
    throw new apiError(400, "Invalid Password");
  }

  user.password = newPassword;
  await user.save({validate:false});

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Password Change Successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200)
  .json(new apiResponse(200, req.user, "User detail fetch successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email, bio } = req.body;

  // Validate input
  if (!fullname || !email || !bio) {
    throw new apiError(400, "All fields are required");
  }

  // Prevent duplicate email
  const existingUser = await users.findOne({ where: { email } });
  if (existingUser && existingUser.id !== req.user.id) {
    throw new apiError(400, "Email already in use");
  }

  // Update user details
  await users.update(
    { fullname, email, bio },
    { where: { id: req.user?.id } }
  );

  // Fetch updated user info
  const updatedUser = await users.findByPk(req.user.id, {
    attributes: ["id", "fullname", "email", "bio"],
  });

  // Return success response
  return res
    .status(200)
    .json(new apiResponse(200, updatedUser, "Account details updated"));
});

const updateUserAvtar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is missing");
  }

  const avatar = await uploadCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new apiError(400, "Error while uploading on avtar");
  }



  const update = await users.update(
    { avatar: avatar.url },
    {
      where: {
        id: req.user?.id,
      },
    }
  )

  const updatedUser = await users.findByPk(req.user.id, {
  attributes: ["id", "fullname", "email", "avatar", "bio"],

});
return res.status(200).json(new apiResponse(200, updatedUser, "User update successfully"))
  
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  changeCurrentPAssword,
  updateAccountDetails,
  updateUserAvtar,
};
