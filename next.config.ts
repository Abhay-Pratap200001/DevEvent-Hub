import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep mongoose out of the Turbopack/webpack bundle so it uses Node's real
  // dns/net/tls modules directly, instead of a bundled copy with its own dns
  // state (which caused dns.setServers() in lib/mongodb.ts to have no effect).
  serverExternalPackages: ['mongoose'],
 images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "res.cloudinary.com",
    },
    {
      protocol: "https",
      hostname: "example.com",
    },
  ],
},
  /* config options here */
};

export default nextConfig;
