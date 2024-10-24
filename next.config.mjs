/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: false,
  env: {
    API_URL: process.env.API_URL,
  },
};

export default nextConfig;
