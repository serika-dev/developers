import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from './providers/ThemeProvider';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
