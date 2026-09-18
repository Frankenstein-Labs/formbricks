import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "prisma/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

config({ quiet: true });
config({ path: path.resolve(__dirname, "../../.env"), quiet: true });

export default defineConfig({
  schema: "./schema",
  migrations: {
    path: "./.prisma-migrations",
  },
  datasource: {
    // Prisma 7 requires a datasource URL while loading this config, even for
    // `prisma generate`, which does not connect to the database. Keep the
    // production URL when it is configured and use a local-only build-time
    // fallback so code generation can run in deployments without database
    // credentials. Migrations and runtime queries still require DATABASE_URL.
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/formbricks",
    ...(process.env.SHADOW_DATABASE_URL && {
      shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
    }),
  },
});
