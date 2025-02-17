import type { Metadata } from "next";
import "./globals.css";
import 'bulma/css/bulma.min.css'
import 'bulma-switch/dist/css/bulma-switch.min.css'
import Navbar from "@/components/navbar/Navbar";

import { ThemeProvider } from '@/contexts/ThemeContext';

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
      <body className={"container"}>

      <ThemeProvider>
            <Navbar/>

            {children}

      </ThemeProvider>

      </body>

    </html>
  );
}
