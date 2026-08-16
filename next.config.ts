import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        unoptimized: true,
    },
    async redirects() {
        return [
            {
                source: "/:path((?!_next/|api/|favicon.ico).*)",
                destination: "https://tools.strixon.co.uk",
                permanent: false,
            },
        ];
    },
};

export default nextConfig;
