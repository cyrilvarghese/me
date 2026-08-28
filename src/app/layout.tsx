import type { Metadata } from "next";
import { Fraunces, Work_Sans, JetBrains_Mono } from "next/font/google";
import MotionProvider from "@/components/MotionProvider";
import SmoothAnchors from "@/components/SmoothAnchors";
import "./tokens.css";
import "./globals.css";

const serif = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
  variable: "--font-serif",
});

const sans = Work_Sans({
  subsets: ["latin"],
  /* the real italic, not a synthesised slant: body copy carries emphasis
     with <em>, and without this the browser shears the roman instead of
     using Work Sans' own italic letterforms */
  style: ["normal", "italic"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Cyril Varghese — Product Builder",
  description:
    "I work across product, design, engineering and AI to turn ambiguous problems into shipped systems.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* Dev-only morph tuner. The gate has to sit on the IMPORT, not on the
     JSX: a "use client" module named by a static import is registered as a
     client reference and webpack keeps its chunk even when the element is
     unreachable. Behind a folded constant the dynamic import is dropped
     outright, so nothing of it reaches the export. */
  const SpringTuner =
    process.env.NODE_ENV === "development"
      ? (await import("@/components/dev/SpringTuner")).default
      : null;
  return (
    <html
      lang="en"
      /* Next 16 no longer overrides CSS smooth-scroll during navigation;
         without this the scroll-to-top animates mid view-transition */
      data-scroll-behavior="smooth"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <SmoothAnchors />
        <MotionProvider>{children}</MotionProvider>
        {SpringTuner && <SpringTuner />}
      </body>
    </html>
  );
}
