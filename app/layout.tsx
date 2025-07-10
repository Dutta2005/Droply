import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
// import { ToastProvider } from "@heroui/toast";
import {ToastContainer} from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Droply",
  description: "A modern file storing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
        <ToastContainer />
          {children}
          </Providers>
      </body>
    </html>
    </ClerkProvider>
  );
}
