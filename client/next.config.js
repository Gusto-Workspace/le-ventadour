/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  pageExtensions: ["api.js", "page.js"],
  async redirects() {
    return [
      { source: "/carte-menus", destination: "/menus", permanent: true },
    ];
  },
};

module.exports = nextConfig;
