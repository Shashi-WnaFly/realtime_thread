import { query } from "../../db/db.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import {
  Category,
  CategoryRow,
  mapCategoryRow,
  mapThreadDetailRow,
  ThreadDetail,
  ThreadDetailRow,
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

  return getThreadById(threadId);
}

export async function getThreadById(id: number): Promise<ThreadDetail> {
  const result = await query<ThreadDetailRow>(
    `
        SELECT 
            t.id,
            t.title,
            t.body,
            t.created_at,
            t.updated_at,
            c.slug AS category_slug,
            c.name AS category_name,
            u.display_name AS author_display_name,
            u.handle AS author_handle
        FROM threads t
        JOIN categories c ON c.id = t.category_id
        JOIN users u ON u.id = t.author_user_id
        WHERE t.id = $1
        LIMIT 1;
        `,
    [id],
  );

  const thread = result.rows[0];

  if(!thread){
    throw new NotFoundError("Thread not found")
  }

  return mapThreadDetailRow(thread); 

}
