import type { Metadata } from "next";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "AI Writing Assistant",
  description: "AI-powered writing assistant with prompt building capabilities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-gray-100">
        {children}
      </body>
    </html>
  );
}
