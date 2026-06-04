import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JetMind | AI-Powered Hospitality Decision Support",
  description: "Decision-support platform for Jetwing Symphony PLC",
  icons: {
    icon: "/jetwing-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full text-slate-900`}
        style={{backgroundColor: '#ffffff'}}
      >
        <div className="flex h-full">
          <Sidebar />
          <div className="flex-1 ml-64 flex flex-col">
            <TopNav />
            <main className="flex-1 p-8 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
