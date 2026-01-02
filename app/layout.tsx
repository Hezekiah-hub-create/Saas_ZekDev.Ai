import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/provider/theme-provider";

const outfitSans = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cognivox AI",
  description: "AI powered SaaS platform",
  icons: {
    icon: "/ai_icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${outfitSans.variable} ${outfitSans.variable} font-sans antialiased`}
      >
        <Toaster position="top-center" theme="dark" duration={5000}/>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
