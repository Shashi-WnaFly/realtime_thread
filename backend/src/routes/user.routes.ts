import { Router } from "express";
import {
  toUserProfileResponse,
  UserProfile,
  UserProfileResponse,
} from "../modules/users/user.types.js";

const userRouter = Router();

import z from "zod";

const UserProfileUpdateSchema = z.object({
    displayName: z.string().trim().optional(),
    handle: z.string().trim().optional(),
    bio: z.string().trim().optional(),
    avatarUrl: z.url()
});

function toResponse(profile: UserProfile): UserProfileResponse {
  return toUserProfileResponse(profile);
}
