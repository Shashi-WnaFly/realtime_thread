import { Router } from "express";
import { createdThread, listCategories } from "../modules/threads/threads.repository.js";
import { getAuth } from "../config/clerk.js";
import { UnauthorizedError } from "../lib/errors.js";
import { z } from "zod";
import { getUserFromClerk } from "../modules/users/user.service.js";

export const threadsRouter = Router();

const createdThreadSchema = z.object({
  title: z.string().trim().min(5).max(200),
  body: z.string().trim().min(10).max(2000),
  categorySlug: z.string().trim().min(1),
});

threadsRouter.get("/categories", async (_req, res, next) => {
  try {
    const listOfCategories = await listCategories();

    res.json({
      data: listOfCategories,
    });
  } catch (error) {
    next(error);
  }
});

threadsRouter.post("/threads", async (req, res, next) => {
  try {
    const auth = getAuth(req);

    if (!auth.userId) {
      throw new UnauthorizedError("Unauthorized!!");
    }

    const parsedBody = createdThreadSchema.parse(req.body);

    const profile = await getUserFromClerk(auth.userId);

    const newlyCreatedThread = await createdThread({
      categorySlug: parsedBody.categorySlug,
      authorUserId: profile.user.id,
      title: parsedBody.title,
      body: parsedBody.body,
    });

    res.status(201).json({
      data: newlyCreatedThread,
    });
  } catch (error) {
    next(error);
  }
});
