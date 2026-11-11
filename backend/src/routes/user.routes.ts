import { Router } from "express";
import {
  toUserProfileResponse,
  type UserProfile,
  type UserProfileResponse,
} from "../modules/users/user.types.js";
import { getAuth } from "../config/clerk.js";

const userRouter = Router();

import {z} from "zod";
import { UnauthorizedError } from "../lib/errors.js";
import {
  getUserFromClerk,
  updateUserProfile,
} from "../modules/users/user.service.js";

const UserProfileUpdateSchema = z.object({
  displayName: z.string().trim().optional(),
  handle: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  avatarUrl: z.url().optional(),
});

function toResponse(profile: UserProfile): UserProfileResponse {
  return toUserProfileResponse(profile);
}

// user get /me

userRouter.get("/", async (req, res, next) => {
  try {
    const auth = getAuth(req);

    if (!auth.userId) {
      throw new UnauthorizedError("Unauthorized!!");
    }

    const profile = await getUserFromClerk(auth.userId);
    const response = toResponse(profile);
    res.json({
      data: response,
    });
  } catch (error) {
    next(error);
  }
});

// user update /me

userRouter.patch("/", async (req, res, next) => {
  try {
    const auth = getAuth(req);

    if (!auth.userId) {
      throw new UnauthorizedError("Unauthorized!!");
    }

    const updateProperty = UserProfileUpdateSchema.parse(req.body);

    const displayName =
      updateProperty.displayName &&
      updateProperty.displayName?.trim().length > 0
        ? updateProperty.displayName?.trim()
        : undefined;
    const bio =
      updateProperty.bio && updateProperty.bio?.trim().length > 0
        ? updateProperty.bio?.trim()
        : undefined;
    const avatarUrl =
      updateProperty.avatarUrl && updateProperty.avatarUrl?.trim().length > 0
        ? updateProperty.avatarUrl?.trim()
        : undefined;
    const handle =
      updateProperty.handle && updateProperty.handle?.trim().length > 0
        ? updateProperty.handle?.trim()
        : undefined;

    try {
      const profile = await updateUserProfile({
        clerkUserId: auth.userId,
        displayName,
        bio,
        handle,
        avatarUrl,
      });
      const response = toResponse(profile);
      res.json({
        data: response,
      });
    } catch (e) {
      throw e;
    }
  } catch (error) {
    next(error);
  }
});

export default userRouter;
