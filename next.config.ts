import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/myjob",
        destination: "/our-pillars",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
