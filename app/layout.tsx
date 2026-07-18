import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Suvarna Label",
  description: "Order, inventory, production and media operations",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
