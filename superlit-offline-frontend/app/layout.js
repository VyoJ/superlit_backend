"use client";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";

export const metadata = {
  title: "Superlit",
  description: "Superlit",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className="{inter.className} overflow-x-hidden">{children}</body>
      </AuthProvider>
    </html>
  );
}
