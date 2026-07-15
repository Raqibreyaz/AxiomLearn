import { Request, Response } from "express";
import User from "../models/User.js";
import Session from "../models/Session.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { createSession } from "../helpers/create-session.js";
import { cookieOptions } from "../config/session.js";
import { deleteFile, uploadFile } from "../services/s3.service.js";
import { rm } from "node:fs/promises";
import { signupSchema, loginSchema, updateProfileSchema, updateRoleSchema } from "../schemas/auth.schemas.js";
import * as z from "zod";
import { UserParams } from "../types/params.js";

// @desc    Register a new user
// @route   POST /api/v1/auth/signup
// @access  Public
export const signup = async (
  req: Request<{}, any, z.infer<typeof signupSchema>>,
  res: Response,
) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Create User
  const user = await User.create({
    name,
    email,
    password,
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
export const login = async (
  req: Request<{}, any, z.infer<typeof loginSchema>>,
  res: Response,
) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.password) {
    throw new ApiError(401, "Invalid user credentials");
  }

  if (user.isSuspended) {
    throw new ApiError(403, "Your account is suspended");
  }

  const isPasswordValid = await user.comparePassword(password);

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
export const update = async (
  req: Request<{}, any, z.infer<typeof updateProfileSchema>>,
  res: Response,
) => {
  const { name, email, phone, newPassword, password, bio } = req.body;

  const user = req.user ? await User.findById(req.user._id) : null;
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Handle password update if newPassword is provided
  if (newPassword) {
    const isPasswordValid = await user.comparePassword(password || "");
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid current password");
    }

    user.password = newPassword;
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

export const getUsers = async (_req: Request, res: Response) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users retrieved successfully"));
};

// @desc    Update a user's role (promote/demote)
// @route   PATCH /api/v1/auth/users/:userId/role
// @access  Private (Admin only)
export const updateUserRole = async (
  req: Request<UserParams, any, z.infer<typeof updateRoleSchema>>,
  res: Response,
) => {
  const { userId } = req.params;
  const { role } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Prevent modifying an admin's role through this general promote/demote route
  if (user.role === "admin") {
    throw new ApiError(400, "Cannot change the role of an administrative user");
  }

  user.role = role;
  await user.save();

  // Exclude password from the returned object
  const updatedUser = user.toObject();
  delete updatedUser["password"];

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, `User role updated to ${role} successfully`));
};