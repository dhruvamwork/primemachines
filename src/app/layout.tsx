import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalNavigation from "@/components/GlobalNavigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prime Construction Machines | Premium Construction Equipment Rental",
  description: "India's leading B2B marketplace for heavy construction machinery.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased text-secondary bg-gray-50`}>
        {children}
        <GlobalNavigation />
      </body>
    </html>
  );
}
