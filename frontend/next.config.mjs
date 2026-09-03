/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // Proxy API calls to backend in development
  async rewrites() {
    return process.env.NODE_ENV === "development"
      ? [
          {
            source: "/api/:path*",
            destination: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/:path*`,
          },
        ]
      : [];
  },
};

export default nextConfig;
