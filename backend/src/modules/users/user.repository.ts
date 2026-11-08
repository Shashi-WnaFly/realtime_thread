import { query } from "../../db/db.js";
import { User, UserRow } from "./user.types.js";

function hydrateUser(row: UserRow): User {
  return {
    id: row.id,
    displayName: row.display_name,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    handle: row.handle,
    clerkUserId: row.clerk_user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function upsertUserFromClerkProfile(params: {
  clerkUserId: string;
  displayName: string | null;
  avatarUrl: string | null;
}): Promise<User> {
  const { clerkUserId, displayName, avatarUrl } = params;
  const result = await query<UserRow>(
    `
        INSERT INTO users (clerk_user_id, display_name, avatar_url)
        VALUES ($1, $2, $3)
        ON CONFLICT (clerk_user_id)
        DO UPDATE SET
          display_name = EXCLUDED.display_name,
          avatar_url = EXCLUDED.avatar_url,
          updated_at = NOW()
        RETURNING
          id,
          clerk_user_id,
          display_name,
          handle,
          avatar_url,
          bio,
          created_at,
          updated_at
        `,
    [clerkUserId, displayName, avatarUrl],
  );

  return hydrateUser(result.rows[0]);
}

export async function repoUpdateUserProfile(params: {
  clerkUserId: string;
  displayName?: string;
  bio?: string;
  handle?: string;
  avatarUrl?: string;
}): Promise<User> {
  const { clerkUserId, displayName, bio, handle, avatarUrl } = params;

  const updateKeys: string[] = [];
  const updateValues: unknown[] = [clerkUserId]; // $1 is always the clerk_user_id (used in WHERE clause)
  let idx = 2; // for query $2 $3

  if (typeof displayName !== undefined) {
    updateKeys.push(`display_name = $${idx++}`);
    updateValues.push(displayName);
  }
  if (typeof bio !== undefined) {
    updateKeys.push(`bio = $${idx++}`);
    updateValues.push(bio);
  }
  if (typeof avatarUrl !== undefined) {
    updateKeys.push(`avatar_url = $${idx++}`);
    updateValues.push(avatarUrl);
  }
  if (typeof handle !== undefined) {
    updateKeys.push(`handle = $${idx++}`);
    updateValues.push(handle);
  }

  updateKeys.push(`updated_at = NOW()`);

  const result = await query<UserRow>(
    `
      UPDATE users
      SET ${updateKeys.join(", ")}
      WHERE clerk_user_id = $1
      RETURNING
        id,
        clerk_user_id,
        display_name,
        handle,
        avatar_url,
        bio,
        created_at,
        updated_at
    `,
    updateValues,
  );

  if (result.rows.length === 0) {
    throw new Error(`no user found for clerk user id = ${clerkUserId}`);
  }

  return hydrateUser(result.rows[0]);
}
