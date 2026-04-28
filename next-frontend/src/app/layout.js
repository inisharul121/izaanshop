import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://izaanshop.com"),
  title: "Izaan Shop | Toys, Book & Learning Tools",
  description: "Shop for the best educational toys and books for children at Izaan Shop.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body 
        className={`${inter.variable} font-sans min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <div className="print:hidden">
          <Navbar />
        </div>
        <main className="flex-grow">
          {children}
        </main>
        <div className="print:hidden">
          <Footer />
        </div>
        <SpeedInsights />
      </body>
    </html>
  );
}
