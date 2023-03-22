/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['avatars.githubusercontent.com', 'thumbs.dreamstime.com'],
    },
};

module.exports = nextConfig;
