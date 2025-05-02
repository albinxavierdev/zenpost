import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
        search: "",
      },
    ],
  },
  // Suppress hydration warnings - useful when browser extensions modify the DOM
  reactStrictMode: false,
  onDemandEntries: {
    // Keep the build page in the buffer for longer
    maxInactiveAge: 25 * 1000,
  },
};

export default nextConfig;
