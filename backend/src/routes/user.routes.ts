import { Router } from "express";
import {
  toUserProfileResponse,
  type UserProfile,
  type UserProfileResponse,
} from "../modules/users/user.types.js";
import { getAuth } from "../config/clerk.js";

const userRouter = Router();

import z from "zod";
import { UnauthorizedError } from "../lib/errors.js";
import { getUserFromClerk } from "../modules/users/user.service.js";

const UserProfileUpdateSchema = z.object({
  displayName: z.string().trim().optional(),
  handle: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  avatarUrl: z.url(),
});

function toResponse(profile: UserProfile): UserProfileResponse {
  return toUserProfileResponse(profile);
}

// user get /me

userRouter.get("/", async (req, res, next) => {
  try {
    console.log("/api/me called");
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

export default userRouter;
