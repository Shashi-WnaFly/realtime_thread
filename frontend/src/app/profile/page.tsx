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
    const isMounted = true;

    try {
      setIsLoading(true);
      async function loadProfile() {
        const user = await apiGet<UserResponse>(apiClient, "/api/me");

        console.log("load profile ", user);

        if (!isMounted) {
          return;
        }

        form.reset({
          displayName: user?.displayName ?? "",
          bio: user?.bio ?? "",
          handle: user?.handle ?? "",
          avatarUrl: user?.avatarUrl ?? "",
        });
      }

      loadProfile();
    } catch (err: any) {
      console.log(err);
    }
    finally{
        if(isMounted){
            setIsLoading(false);
        }
    }
  }, [apiClient, form]);

  return <div>profilePage</div>;
}
