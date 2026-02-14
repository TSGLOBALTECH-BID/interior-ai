import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InteriorAI - AI-Powered Interior Design Agent",
  description: "Generate stunning interior design ideas using AI. Get room visualizations, color palettes, and furniture recommendations powered by Hugging Face.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
