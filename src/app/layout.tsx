import "./globals.css";
import Providers from "@/app/providers";
import Navbar from "@/components/Navbar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <header className="border-b">
            <Navbar />
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}
