import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

const russianRail = localFont({
  src: "../../public/fonts/russian-rail-g-pro-regular.otf",
  variable: "--font-russian-rail",
  weight: "400",
  style: "normal",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  title: "Туристские поезда России",
  description:
    "Витрина туристских поездов: маршруты, даты отправления и экскурсионные программы по России.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${russianRail.variable} min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
