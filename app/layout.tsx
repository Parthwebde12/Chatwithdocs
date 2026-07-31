import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat with Docs",
  description: "Upload a document and ask questions about it",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
