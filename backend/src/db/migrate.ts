import path from "node:path";
import fs from "node:fs";
import { logger } from "../lib/logger.js";
import { query } from "./db.js";

const migrationDir = path.resolve(process.cwd(), "src", "migrations");

async function runMigrations() {
  logger.info(`looking for migrations in ${migrationDir}`);

  const files = fs
    .readdirSync(migrationDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    logger.info("no migration found!");
    return;
  }

  for (const file of files) {
    const fullPath = path.join(migrationDir, file);
    const sql = fs.readFileSync(fullPath, "utf8");

    logger.info("Running migrations");

    await query(sql);

    logger.info("Finished migrations");
  }
}

runMigrations()
  .then(() => {
    logger.info("All migration run successfully");
    process.exit(0);
  })
  .catch((err) => {
    logger.info(`Migrations failed ${(err as Error).message}`);
    process.exit(1);
  });
