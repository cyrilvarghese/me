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
      /* about/layout.tsx puts data-theme on this element before React
         hydrates (so the light room paints light on a hard load), and
         React would otherwise report the attribute it did not render.
         This silences mismatches on <html> only — nothing beneath it. */
      suppressHydrationWarning
    >
      <body>
        <SmoothAnchors />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
