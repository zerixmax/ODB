import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OleaD Board (ODB) | Executive Dev Cockpit",
  description: "Operativni dashboard za praćenje statusa projekata, radnih sati, VPS migracija i financijskih ciljeva.",
  icons: {
    icon: "/olead_logo.jpg",
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
