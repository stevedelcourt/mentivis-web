import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const isFtpBuild = process.env.NEXT_BUILD_TARGET === "ftp";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  ...(isFtpBuild
    ? { output: "export" }
    : {
        async redirects() {
          return [
            // Legacy product pages → current MentivisOS page
            { source: "/fr/learningos", destination: "/fr/mentivisos", permanent: true },
            { source: "/fr/learningos/", destination: "/fr/mentivisos", permanent: true },
            { source: "/en/learningos", destination: "/en/mentivisos", permanent: true },
            { source: "/en/learningos/", destination: "/en/mentivisos", permanent: true },
            { source: "/fr/talentos", destination: "/fr/mentivisos", permanent: true },
            { source: "/fr/talentos/", destination: "/fr/mentivisos", permanent: true },
            { source: "/en/talentos", destination: "/en/mentivisos", permanent: true },
            { source: "/en/talentos/", destination: "/en/mentivisos", permanent: true },
          ];
        },
      }),
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
