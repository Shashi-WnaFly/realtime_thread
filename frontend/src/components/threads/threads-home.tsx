"use client";

import { Category, ThreadSummary } from "@/app/types/thread";
import { apiGet, createBrowserApiClient } from "@/lib/api-client";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function ThreadsHomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const router = useRouter();

  const { getToken } = useAuth();
  const apiClient = useMemo(() => createBrowserApiClient(getToken), [getToken]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setIsLoading(true);

        const [extractCategories, extractThreads] = await Promise.all([
          apiGet<Category[]>(apiClient, "/api/threads/categories"),
          apiGet<ThreadSummary[]>(apiClient, "/api/threads/threads"),
        ]);

        if(!isMounted)
          return;
        setCategories(extractCategories);
        setThreads(extractThreads);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
        isMounted = false;
      }
    }
    load();
  }, [apiClient]);

  return (
    <div>
      <Link href={"/threads/new"}>Add New Thread</Link>
    </div>
  );
}

export default ThreadsHomePage;
