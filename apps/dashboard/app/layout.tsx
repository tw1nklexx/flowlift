import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlowLift",
  description: "Onboarding personalization for SaaS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
