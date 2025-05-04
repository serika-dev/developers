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

export const metadata: Metadata = {
  title: {
    default: "Serika.dev Developer Portal",
    template: "%s | Serika.dev Developer Portal"
  },
  description: "Manage your API keys, explore documentation, and test Serika.dev's powerful AI capabilities in our developer portal.",
  keywords: ["API", "AI", "Developer", "Portal", "Serika", "Documentation"],
  authors: [{ name: "Serika.dev" }],
  openGraph: {
    title: "Serika.dev Developer Portal",
    description: "Manage your API keys, explore documentation, and test Serika.dev's powerful AI capabilities.",
    type: "website",
    siteName: "Serika.dev Developer Portal"
  }
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
        style={{ color: '#111827', backgroundColor: '#f3f4f6' }}
      >
        {children}
      </body>
    </html>
  );
}
