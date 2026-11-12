"use client";
import { Category } from "@/app/types/thread";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiGet, createBrowserApiClient } from "@/lib/api-client";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const newThreadSchema = z.object({
  title: z.string().trim().min(5, "Title is too short"),
  body: z.string().trim().min(15, "Body is too short"),
  categorySlug: z.string().trim().min(1, "category is required"),
});

type NewThreadFormValues = z.infer<typeof newThreadSchema>;

function NewThreadPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getToken } = useAuth();
  const apiClient = useMemo(() => createBrowserApiClient(getToken), [getToken]);

  const form = useForm<NewThreadFormValues>({
    resolver: zodResolver(newThreadSchema),
    defaultValues: {
      title: "",
      body: "",
      categorySlug: "",
    },
  });

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      try {
        const loadCats = await apiGet<Category[]>(
          apiClient,
          "/api/threads/categories",
        );

        if (!isMounted) return;

        setCategories(loadCats);

        if (loadCats.length > 0) {
          form.setValue("categorySlug", loadCats[0].slug);
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
  }, [apiClient, form]);

  async function onThreadSubmit(values: NewThreadFormValues) {
    console.log(values);
    setIsSubmitting(true);
    function createNewThread() {
      try {
        console.log(isSubmitting);
        const thread = newThreadSchema.parse(values);

        console.log(thread);
      } catch (error) {
        console.log(error);
      } finally {
        setIsSubmitting(false);
      }
    }
    createNewThread();
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Start a new Thread
        </h1>
      </div>

      <Card className="border-border/70 bg-card">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Thread Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onThreadSubmit)}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-sm font-semibold text-foreground"
              >
                Thread Title
              </label>
              <Input
                id="title"
                placeholder="Thread title..."
                {...form.register("title")}
                disabled={isLoading || isSubmitting}
                className="border-border bg-background/70 text-sm mt-2"
              ></Input>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="category"
                className="text-sm font-semibold text-foreground"
              >
                Category
              </label>
              <select
                id="category"
                {...form.register("categorySlug")}
                disabled={isLoading || isSubmitting}
                className="h-10 transition-all mt-2 w-full rounded-md border border-border bg-background/70 px-3 text-sm text-foreground focus:outline focus:ring-2 focus:ring-primary/30"
              >
                {categories.map((cat) => (
                  <option id={cat.slug} key={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="body"
                className="text-sm font-semibold text-foreground"
              >
                Description
              </label>
              <Textarea
                id="body"
                rows={10}
                placeholder="Thread description"
                disabled={isLoading || isSubmitting}
                {...form.register("body")}
                className=" mt-2 border-border bg-background/70 text-sm"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end px-0 pt-5 border-t border-border">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            {isSubmitting ? "Submitting..." : "Publish Thread"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default NewThreadPage;
