import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep a production build from replacing chunks used by a running dev server.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
