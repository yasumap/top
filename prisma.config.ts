// prisma.config.ts
// Prisma 7 用の設定ファイル

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations", // まだなくてもOK。あとでマイグレーション作るとここに入る
  },
  datasource: {
    // ここで .env の DATABASE_URL を読む
    url: env("DATABASE_URL"),
  },
});
