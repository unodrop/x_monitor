import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "openai.com",
      },
      {
        protocol: "https",
        hostname: "gleam.io",
      },
      {
        protocol: "https",
        hostname: "phantom.com",
      },
      {
        protocol: "https",
        hostname: "wagmi.sh",
      },
      {
        protocol: "https",
        hostname: "beta.solpg.io",
      },
      {
        protocol: "https",
        hostname: "questn.com",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
    ],
  },
};

export default nextConfig;
