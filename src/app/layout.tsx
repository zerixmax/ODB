import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#525928",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "OleaD",
  description: "Codex non verba - Digitalna rješenja i AgroTech inovacije.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico?v=2" },
      { url: "/favicon-16x16.png?v=2", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png?v=2", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "OleaD",
    description: "Codex non verba - Digitalna rješenja i AgroTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr">
      <body className="min-h-screen bg-[#f7f9f6] text-[#1c281e] antialiased selection:bg-[#5d8534] selection:text-white">
        {children}
      </body>
    </html>
  );
}

