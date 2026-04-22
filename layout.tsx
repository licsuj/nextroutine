import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Next Routine — AI-Personalized Fitness & Daily Routines",
  description:
    "Generate a personalized workout or daily routine in 60 seconds. Built around your schedule, goals, and limits — and adapts as you improve. Free to start.",
  openGraph: {
    title: "Next Routine — AI-Personalized Fitness & Daily Routines",
    description:
      "Generate a personalized workout or daily routine in 60 seconds. Built around your schedule, goals, and limits — and adapts as you improve. Free to start.",
    url: "https://nextroutine.com",
    siteName: "Next Routine",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Next Routine — AI-Personalized Fitness & Daily Routines",
    description:
      "Generate a personalized routine in 60 seconds. Free to start.",
  },
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
