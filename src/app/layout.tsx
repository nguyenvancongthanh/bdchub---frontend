import 'devextreme/dist/css/dx.light.css';
import type { Metadata } from "next";
import { Inter, Roboto_Mono, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/MainProvider";

const interFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const outfitFont = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

const monoFont = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Big Data Club",
  description: "Big Data Club - HCMUT",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfitFont.variable} ${interFont.variable} ${monoFont.variable} font-body antialiased overflow-x-hidden no-scrollbar`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}