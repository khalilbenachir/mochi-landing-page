import { defineConfig, devices } from "@playwright/test";
import { baseOrigin, basePort } from "./tests/e2e/origin";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: baseOrigin,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"],
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npm run start -- --port ${basePort}`,
    cwd: process.cwd(),
    // `/` redirects to `localhost`; probe a non-redirecting localized route on the same origin.
    url: new URL("/fr", baseOrigin).toString(),
    reuseExistingServer: process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === "1",
    timeout: 120_000,
  },
});
