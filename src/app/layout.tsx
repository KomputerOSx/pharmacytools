import type { Metadata } from "next";
import "./globals.css";
import "bulma/css/bulma.min.css";
import "bulma-switch/dist/css/bulma-switch.min.css";
import Navbar from "@/components/navbar/Navbar";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

import { ThemeProvider } from "@/contexts/ThemeContext";
import Footer from "@/components/Footer/Footer";

import { Suspense } from "react";
import Loading from "./loading";

export const metadata: Metadata = {
    title: "Pharmacy Tools",
    description: "Pharmacy Tools by Ramyar Abdullah",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={""}>
                <ThemeProvider>
                    <Navbar />
                    <Suspense fallback={<Loading />}>{children}</Suspense>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
