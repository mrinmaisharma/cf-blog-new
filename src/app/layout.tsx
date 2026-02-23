import "./globals.css";
import Providers from "@/app/providers";
import { DM_Sans } from "next/font/google";
import NavbarClient from "@/components/Navbar.client";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable}`} suppressHydrationWarning>
        <Providers>
          <header>
            <NavbarClient />
          </header>
          <div className="bg-[#F9F7F4]">
            <div className="min-h-screen sm:max-w-[90vw] w-full mx-auto sm:px-0 px-4 py-10">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
