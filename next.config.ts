import type { NextConfig } from "next"

// Allow next/image to load uploaded media served by the Django API.
const apiUrl = new URL(
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1"
)

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: "/media/**",
      },
    ],
  },
}

export default nextConfig
