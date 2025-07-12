import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Link from "next/link";

export const metadata: Metadata = {
  title: "ServicePro",
  description: "Service Center CRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <footer className="bg-white border-t">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center space-x-6">
              <Link href="/about" className="text-gray-500 hover:text-gray-700">
                About
              </Link>
              <Link href="/contact" className="text-gray-500 hover:text-gray-700">
                Contact
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-700">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-gray-500 hover:text-gray-700">
                Privacy Policy
              </Link>
              <Link href="/support" className="text-gray-500 hover:text-gray-700">
                Support
              </Link>
            </div>
            <div className="mt-8">
              <p className="text-center text-gray-400">
                &copy; 2024 ServicePro. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
