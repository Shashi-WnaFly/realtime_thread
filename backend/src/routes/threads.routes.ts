import { Router } from "express";
import {
  createdThread,
  extractListOfThreads,
  getThreadById,
  listCategories,
  parseThreadListFilter,
} from "../modules/threads/threads.repository.js";
import { getAuth } from "../config/clerk.js";
import { BadRequestError, UnauthorizedError } from "../lib/errors.js";
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

threadsRouter.post("/create", async (req, res, next) => {
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

threadsRouter.get("/threads/:threadId", async (req, res, next) => {
  try {
    const threadId = Number(req.params.threadId);

    if (!Number.isInteger(threadId) || threadId <= 0) {
      throw new BadRequestError("Invalid thread id");
    }

    const auth = getAuth(req);

    if (!auth.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    // const profile = await getUserFromClerk(auth.userId);
    // const viewerUserId = profile.user.id;

    const thread = await getThreadById(threadId);

    res.json({
      data: thread,
    });
  } catch (error) {
    next(error);
  }
});

threadsRouter.get("/threads", async (req, res, next) => {
  try {
    const { page, pageSize, q, category, sort } = req.query;
    const filter = parseThreadListFilter({
      page,
      pageSize,
      q,
      category,
      sort,
    });

    
    const threadsList = await extractListOfThreads(filter);
    
    res.json({
      data: threadsList,
    });
  } catch (error) {
    next(error);
  }
});
