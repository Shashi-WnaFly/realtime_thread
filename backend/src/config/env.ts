import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  PORT: z.string().default(process.env.PORT!),
  DB_HOST: z.string().default(process.env.DB_HOST!),
  DB_PORT: z.string().default(process.env.DB_PORT!),
  DB_NAME: z.string().default(process.env.DB_NAME!),
  DB_USER: z.string().default(process.env.DB_USER!),
  DB_PASSWORD: z.string().default(process.env.DB_PASSWORD!),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(parsed.error);
  process.exit(1);
}

export default parsed.data;
