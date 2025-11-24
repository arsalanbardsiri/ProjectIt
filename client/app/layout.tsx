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
  title: "ProjectIt | Study Smarter Together",
  description: "A modern, distributed real-time study platform. Join virtual study rooms, collaborate via WebSocket chat, and master your subjects.",
  keywords: ["study", "collaboration", "real-time", "websocket", "redis", "nextjs", "typescript"],
  authors: [{ name: "Arsalan Bardsiri" }],
  openGraph: {
    title: "ProjectIt | Study Smarter Together",
    description: "Join virtual study rooms and collaborate in real-time.",
    url: "https://projectit.vercel.app",
    siteName: "ProjectIt",
    images: [
      {
        url: "/og-image.png", // We can add a placeholder or generate one later
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProjectIt | Study Smarter Together",
    description: "A modern, distributed real-time study platform.",
  },
  icons: {
    icon: "/icon.svg",
  },
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
      </body>
    </html>
  );
}
