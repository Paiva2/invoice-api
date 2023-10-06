import { defineConfig } from "vitest/dist/config"

export default defineConfig({
  plugins: [],
  test: {
    environmentMatchGlobs: [["src/api/controllers/tests/**", "pg"]],
    dir: "src",
    reporters: [
      "default",
      {
        async onWatcherRerun() {
          await teardown()
          await setup()
        },
      },
    ],
  },
})
