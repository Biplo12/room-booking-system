import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Conference Room Booking",
  description: "Modern conference room booking system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <Toaster />
        <QueryProvider>
          <div className="flex-1">{children}</div>
        </QueryProvider>
        <Footer />
      </body>
    </html>
  );
}
