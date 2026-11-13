export type Category = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
};

export type ThreadDetail = {
  id: number;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  category: {
    slug: string;
    name: string;
  };
  author: {
    displayName: string | null;
    handle: string | null;
  };
};

export type ThreadSummary = {
  id: number;
  title: string;
  excerpt: string;
  createdAt: Date;
  category: {
    slug: string;
    name: string;
  };
  author: {
    displayName: string | null;
    handle: string | null;
  };
};