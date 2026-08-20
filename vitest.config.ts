import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    // .claude/worktrees holds live checkouts of other branches. Their test
    // files resolve paths against this repo's cwd, so they fail here for
    // reasons that have nothing to do with this branch.
    exclude: [...configDefaults.exclude, "**/.claude/**"],
  },
});
