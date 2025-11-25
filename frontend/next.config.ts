import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Ensure Turbopack resolves the correct project root
  // This fixes the "cannot find Next.js package" error when the app directory is nested.
  // The root points to the directory containing this config file.
  // Adjust if your project structure changes.



  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
