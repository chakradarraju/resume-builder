import type { NextConfig } from "next";

// const withTM = require('next-transpile-modules')([
//   '@atlaskit/pragmatic-drag-and-drop',
//   // Include other modules if necessary
// ]);

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config: NextConfig, { isServer }) => {
    config.resolve.symlinks = false;
    return config;
  },
};

export default nextConfig;
