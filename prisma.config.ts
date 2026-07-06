import { defineConfig } from "prisma/config";
import fs from "node:fs";
import path from "node:path";

function resolveEnv(): string {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const envPath = path.resolve(file);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const match = content.match(/^DATABASE_URL=(.+)$/m);
      if (match) {
        const value = match[1].trim();
        return value.startsWith('"') && value.endsWith('"')
          ? value.slice(1, -1)
          : value;
      }
    }
  }
  const fromProcess = process.env.DATABASE_URL;
  if (fromProcess) return fromProcess;
  throw new Error("DATABASE_URL is not set in .env or environment");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: resolveEnv(),
  },
});
