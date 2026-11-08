"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiGet, apiPatch, createBrowserApiClient } from "@/lib/api-client";
import { Show, useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const { userId } = useAuth();
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

  async function onSubmit(values: ProfileFormValues) {
    try {
      setIsSaving(true);
      const payload: Record<string, string> = {};

      if (values.displayName) payload.displayName = values.displayName;
      if (values.handle) payload.handle = values.handle.toLowerCase();
      if (values.avatarUrl) payload.avatarUrl = values.avatarUrl;
      if (values.bio) payload.bio = values.bio;

      const apiResult = await apiPatch<typeof payload, UserResponse>(
        apiClient,
        "/api/me",
        payload,
      );

      form.reset({
        displayName: apiResult.displayName ?? "",
        bio: apiResult.bio ?? "",
        avatarUrl: apiResult.avatarUrl ?? "",
        handle: apiResult.handle ?? "",
      });

      toast.success("Profile updated successfully", {
        description: "Your changes have been saved successfully!",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }

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

  const displayNameValue = form.watch("displayName");
  const handleValue = form.watch("handle");
  const avatarUrlValue = form.watch("avatarUrl");

  return (
    <>
      <Show when={"signed-out"}>User is signed out</Show>
      <Show when={"signed-in"}>
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
          <div>
            <h1 className="flex items-center text-3xl font-bold tracking-tight text-foreground">
              <User className="w-8 h-8 text-primary" />
              Profile Settings
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your profile information
            </p>
          </div>
          <Card className="border-border/70 bg-card">
            <CardHeader className="pb-4 flex">
              <div className="flex items-start gap-6">
                <Avatar className={"h-20 w-20"}>
                  {avatarUrlValue && (
                    <AvatarImage
                      src={avatarUrlValue || "/placeholder.xyz"}
                      alt={avatarUrlValue || "profileAvatar"}
                    />
                  )}
                </Avatar>
              </div>

              <div className="flex-1 px-3">
                <CardTitle className="text-2xl text-foreground">
                  {displayNameValue || "Your display name"}
                </CardTitle>
                <div className="mt-1 flex flex-wrap items-center ">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      handleValue
                        ? "bg-primary/10 text-primary"
                        : "bg-accent text-accent-foreground",
                    )}
                  >
                    {handleValue ? `@${handleValue}` : "@handle"}
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-border/70 bg-card">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">
                Edit Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="displayName"
                      className="text-sm text-foreground font-semibold"
                    >
                      Display Name
                    </label>
                    <Input
                      id="displayName"
                      placeholder="Your name..."
                      {...form.register("displayName")}
                      disabled={isLoading || isSaving}
                      className="border-border mt-1 bg-background/60 text-sm "
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="handle"
                      className="text-sm text-foreground font-semibold"
                    >
                      Handle
                    </label>
                    <Input
                      id="handle"
                      placeholder="Your handle..."
                      {...form.register("handle")}
                      disabled={isLoading || isSaving}
                      className="border-border mt-1 bg-background/60 text-sm "
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="bio"
                      className="text-sm text-foreground font-semibold"
                    >
                      Bio
                    </label>
                    <Textarea
                      id="bio"
                      placeholder="Your bio..."
                      {...form.register("bio")}
                      disabled={isLoading || isSaving}
                      className="border-border mt-1 bg-background/60 text-sm "
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="avatarUrl"
                    className="text-sm text-foreground font-semibold"
                  >
                    Avatar URL
                  </label>
                  <Input
                    id="avatarUrl"
                    placeholder="http://www.image.com"
                    {...form.register("avatarUrl")}
                    disabled={isLoading || isSaving}
                    className="border-border mt-1 bg-background/60 text-sm "
                  />
                </div>

                <CardFooter className="p-0">
                  <Button
                    type="submit"
                    disabled={isLoading || isSaving}
                    className={
                      "min-w-[150px] bg-primary text-primary-foreground hover:bg-primary/90"
                    }
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </Show>
    </>
  );
}
