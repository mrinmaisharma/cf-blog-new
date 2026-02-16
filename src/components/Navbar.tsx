"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

function Navbar() {
  const { status } = useSession();
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
    }
  };
  return (
    <nav className="max-w-5xl mx-auto p-4 flex gap-4">
      <Link href="/">Home</Link>
      <Link href="/following">Following</Link>
      <Link href="/search">Search</Link>
      <Link href="/new">Write</Link>
      {status === "authenticated" ? (
        <button onClick={handleLogout} className="ml-auto">
          Logout
        </button>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </nav>
  );
}

export default Navbar;
