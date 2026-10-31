import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default(process.env.PORT!),
  DB_HOST: z.string().default(process.env.DB_HOST!),
  DB_PORT: z.string().default(process.env.DB_PORT!),
  DB_NAME: z.string().default(process.env.DB_NAME!),
  DB_USER: z.string().default(process.env.DB_USER!),
  DB_PASSWORD: z.string().default(process.env.DB_PASSWORD!),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .default(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!),
  CLERK_SECRET_KEY: z.string().default(process.env.CLERK_SECRET_KEY!),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(parsed.error);
  process.exit(1);
}

export default parsed.data;
