import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import {
  sentryReactRouter,
  type SentryReactRouterBuildOptions,
} from "@sentry/react-router";
import * as dotenv from "dotenv";

// Load environment variables from .env files
dotenv.config({ path: ".env.local" });

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "null-9e",
  project: "travel-agency",
  authToken: process.env.SENTRY_AUTH_TOKEN,
};

export default defineConfig((config) => {
  return {
    plugins: [
      tailwindcss(),
      tsconfigPaths(),
      reactRouter(),
      sentryReactRouter(sentryConfig, config),
    ],
    sentryConfig,
    ssr: {
      noExternal: [/@syncfusion/],
    },
  };
});
