import "./globals.css";
// import Providers from "@/app/providers";
// import Link from "next/link";
import { SessionProvider, signOut } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/Navbar";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  
  const session = await getServerSession(authOptions);
  // const { status } = useSession();

  // console.log("Session in RootLayout:", session);

  // const handleLogout = async () => {
  //   try {
  //     await signOut({ callbackUrl: "/" });
  //   } catch (err) {
  //     console.error("Sign out error:", err);
  //   } finally {
  //   }
  // };
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <header className="border-b">
            <Navbar />
          </header>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
