

const nextConfig = {
  transpilePackages: [],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.aria.ai" },
    ],
  },
};

export default nextConfig;
