import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A fully static marketing page: `next build` writes plain files to `out/`
  // that any static host (Vercel, Netlify, GitHub Pages, S3) can serve.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
