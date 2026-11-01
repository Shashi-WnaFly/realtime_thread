export type UserRow = {
  id: number;
  clerk_user_id: string;
  bio: string | null;
  avatar_url: string | null;
  handle: string | null;
  display_name: string | null;
  created_at: Date;
  updated_at: Date;
};

export type User = {
  id: number;
  clerkUserId: string;
  bio: string | null;
  avatarUrl: string | null;
  handle: string | null;
  displayName: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UserProfile = {
  user: User;
  clerkEmail: string | null;
  clerkFullName: string | null;
};

export type UserProfileResponse = {
  id: number;
  displayName: string | null;
  clerkUserId: string;
  email: string | null;
  bio: string | null;
  avatarUrl: string | null;
  handle: string | null;
};

export function toUserProfileResponse(
  profile: UserProfile,
): UserProfileResponse {
  const { user, clerkEmail, clerkFullName } = profile;

  return {
    id: user.id,
    bio: user.bio ?? null,
    displayName: user.displayName ?? clerkFullName ?? null,
    handle: user.handle ?? null,
    avatarUrl: user.avatarUrl ?? null,
    email: clerkEmail ?? null,
    clerkUserId: user.clerkUserId,
  };
}
