"use client";

import { apiGet, createBrowserApiClient } from "@/lib/api-client";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const optionalText = z
  .string()
  .transform((value) => value.trim())
  .transform((value) => (value === "" ? undefined : value))
  .optional();

const ProfileSchema = z.object({
  displayName: optionalText,
  bio: optionalText,
  handle: optionalText,
  avatarUrl: optionalText,
});

type ProfileFormValues = z.infer<typeof ProfileSchema>;

type UserResponse = {
  id: number;
  displayName: string | null;
  clerkUserId: string;
  email: string | null;
  bio: string | null;
  avatarUrl: string | null;
  handle: string | null;
};

export default function profilePage() {
  const { getToken } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const apiClient = useMemo(() => createBrowserApiClient(getToken), [getToken]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      displayName: "",
      bio: "",
      handle: "",
      avatarUrl: "",
    },
  });

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setIsLoading(true);
      setProfileError(null);
      try {
        const user = await apiGet<UserResponse>(apiClient, "/api/me");
        
        if (!isMounted) {
          return;
        }

        form.reset({
          displayName: user?.displayName ?? "",
          bio: user?.bio ?? "",
          handle: user?.handle ?? "",
          avatarUrl: user?.avatarUrl ?? "",
        });
      } catch (error) {
        console.error("Failed to load profile", error);
        if (isMounted) {
          setProfileError("Unable to load your profile. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [apiClient, form]);

  return (
    <div>
      {isLoading
        ? "Loading profile..."
        : profileError ?? "profilePage"}
    </div>
  );
}
