import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { NO_FLASH_SCRIPT } from "@/lib/theme";
import ThemeProvider from "@/components/shared/ThemeProvider";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Android Developer Skill Tree",
  description: "Интерактивная платформа оценки и развития Android-разработчика",
  appleWebApp: {
    capable: true,
    title: "Android Skill Tree",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#16140f" },
  ],
  viewportFit: "cover",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={jetbrainsMono.variable}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {NO_FLASH_SCRIPT}
        </Script>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
