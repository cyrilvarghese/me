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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      </body>
    </html>
  );
}
