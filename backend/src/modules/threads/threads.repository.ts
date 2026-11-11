import { query } from "../../db/db.js";
import { BadRequestError } from "../../lib/errors.js";
import {
  Category,
  CategoryRow,
  mapCategoryRow,
  ThreadDetail,
} from "./threads.types.js";

export async function listCategories(): Promise<Category[]> {
  const result = await query<CategoryRow>(
    `
        SELECT id, name, slug, description
        FROM categories
        ORDER BY name ASC;
    `,
  );
  return result.rows.map(mapCategoryRow);
}

export async function createdThread(params: {
  categorySlug: string;
  authorUserId: number;
  title: string;
  body: string;
}): Promise<ThreadDetail> {
  const { categorySlug, authorUserId, title, body } = params;

  const categoryRes = await query<{ id: number }>(
    `
        SELECT id
        FROM categories
        WHERE slug = $1
        LIMIT 1
    `,
    [categorySlug],
  );

  if (categoryRes.rows.length === 0) {
    throw new BadRequestError("Invalid category");
  }

  const categoryId = categoryRes.rows[0].id;

  const insertResult = await query<{ id: number }>(
    `
        INSERT INTO threads (category_id, author_user_id, title, body)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `,
    [categoryId, authorUserId, title, body],
  );

  const threadId = insertResult.rows[0].id;
}
