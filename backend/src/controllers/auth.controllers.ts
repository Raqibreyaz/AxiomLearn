import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/User.js";
import Session from "../models/Session.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { createSession } from "../helpers/create-session.js";
import { cookieOptions } from "../config/session.js";
import { deleteFile, uploadFile } from "../services/s3.service.js";
import { rm } from "node:fs/promises";

// @desc    Register a new user
// @route   POST /api/v1/auth/signup
// @access  Public
export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create User
  const user = await User.create({
    name,
    email,
    password: passwordHash,
    role: "student",
    isSuspended: false,
  });

  const sessionId = await createSession(user._id);

  return res
    .status(201)
    .cookie("sessionId", sessionId, cookieOptions)
    .json(
      new ApiResponse(
        201,
        {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
        "User registered successfully",
      ),
    );
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user || !user.password) {
    throw new ApiError(401, "Invalid user credentials");
  }

  if (user.isSuspended) {
    throw new ApiError(403, "Your account is suspended");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const sessionId = await createSession(user._id);

  return res
    .status(200)
    .cookie("sessionId", sessionId, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
        "User logged in successfully",
      ),
    );
};

// @desc    update user
// @route   PATCH /api/v1/auth/update
// @access  Private
export const update = async (req: Request, res: Response) => {
  const { name, email, phone, newPassword, password, bio } = req.body;

  const user = req.user ? await User.findById(req.user._id) : null;
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Handle password update if newPassword is provided
  if (newPassword) {
    if (!password) {
      throw new ApiError(
        400,
        "Current password is required to update password",
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || "");
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid current password");
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    user.password = passwordHash;
  }

  // Handle email uniqueness check if changing email
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new ApiError(409, "Email is already in use");
    }
    user.email = email;
  }

  // Update other optional fields if provided
  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (bio !== undefined) user.bio = bio;

  await user.save();

  // Return the updated user (exclude password)
  const updatedUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    bio: user.bio,
    avatar: user.avatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
};

// @desc    update user's avatar
// @route   POST /api/v1/auth/...
// @access  Private
export const updateAvatar = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const user = userId ? await User.findById(userId) : null;

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!req.file) {
    throw new ApiError(400, "avatar is required to update!");
  }

  const s3ObjectUrl = await uploadFile(req.file.path);
  const oldAvatarUrl = user.avatar
  user.avatar = s3ObjectUrl;

  try {
    await user.save();

    // delete the old avatar from s3 if it exists
    if (oldAvatarUrl) {
      await deleteFile(oldAvatarUrl);
    }
    // delete the local uploaded file
    await rm(req.file.path);
  } catch (error) {
    await deleteFile(s3ObjectUrl);
    throw error;
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "avatar updated successfully!"));
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response) => {
  const sessionId = req.cookies["sessionId"];

  if (sessionId) {
    await Session.findByIdAndDelete(sessionId);
  }

  return res
    .status(200)
    .clearCookie("sessionId", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
};

// @desc    Get current user details
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User details fetched successfully"));
};
