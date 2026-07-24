import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./StoreProvider";
import { AppInit } from "./appInit";
import { ThemeProvider } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-200`}
      >
      <StoreProvider>
        <ThemeProvider>
         <AppInit>
              {children}
          </AppInit>
        </ThemeProvider>
      </StoreProvider>
      </body>
    </html>
  );
}
