"use client";

import Link from "next/link";

function Navbar() {
    return ( <nav className="max-w-5xl mx-auto p-4 flex gap-4">
              <Link href="/">Home</Link>
              <Link href="/following">Following</Link>
              <Link href="/search">Search</Link>
              <Link href="/new">Write</Link>
              {/* {status === "authenticated" ? (
                <button onClick={handleLogout} className="ml-auto">
                  Logout
                </button>
              ) : (
                <Link href="/login">Login</Link>
              )} */}
            </nav> );
}

export default Navbar;