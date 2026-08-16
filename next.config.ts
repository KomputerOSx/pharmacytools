import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        unoptimized: true,
    },
    async redirects() {
        return [
            {
                source: "/:path*",
                destination: "https://tools.strixon.co.uk/:path*",
                permanent: false,
            },
        ];
    },
};

export default nextConfig;
