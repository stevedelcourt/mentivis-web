import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const isFtpBuild = process.env.NEXT_BUILD_TARGET === "ftp";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Static export ONLY for o2switch FTP builds.
  // Vercel serverless builds skip this so API routes + middleware work.
  ...(isFtpBuild ? { output: "export", trailingSlash: true } : {}),

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
