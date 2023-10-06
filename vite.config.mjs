import { defineConfig } from "vitest/dist/config"

export default defineConfig({
  plugins: [],
  test: {
    environmentMatchGlobs: [["src/api/controllers/tests/**", "pg"]],
    dir: "src",
  },
})
