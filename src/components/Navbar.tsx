"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Logo from "@/assets/blog-logo.png";
import Image from "next/image";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  return (
    <nav className="w-full bg-[#0D0F12] px-4 text-gray-200 font-medium py-0">
      <div className="sm:max-w-[90vw] h-16 w-full mx-auto flex gap-5 items-center py-0">
        {/* logo */}
        <div className="py-4">
          <Link href="/" className="text-white font-bold text-lg">
            <Image src={Logo} alt="Logo" className="inline-block mr-2 p-2" />
          </Link>
        </div>
        {/* links */}
        <div className="text-sm gap-2 sm:gap-5 px-3 grow h-16 items-center hidden sm:flex">
          <Link href="/">
            <div
              className={`hover:text-white px-3 h-16 flex items-center relative group gap-1 ${pathname === "/" ? "active" : ""}`}
            >
              <span className="hidden group-[.active]:block font-bold">/</span>
              Home
              <div className="h-1 bg-[#7833FE] group-hover:w-full group-[.active]:w-full group-[.active]:font-bold duration-300 transition-all ease-in-out absolute bottom-0 left-0 w-0"></div>
            </div>
          </Link>
          <Link href="/following">
            <div
              className={`hover:text-white px-3 h-16 flex items-center relative group gap-1 ${pathname === "/following" ? "active" : ""}`}
            >
              <span className="hidden group-[.active]:block font-bold">/</span>
              Following
              <div className="h-1 bg-[#7833FE] group-hover:w-full group-[.active]:w-full group-[.active]:font-bold duration-300 transition-all ease-in-out absolute bottom-0 left-0 w-0"></div>
            </div>
          </Link>
          <Link href="/search">
            <div
              className={`hover:text-white px-3 h-16 flex items-center relative group gap-1 ${pathname === "/search" ? "active" : ""}`}
            >
              <span className="hidden group-[.active]:block font-bold">/</span>
              Search
              <div className="h-1 bg-[#7833FE] group-hover:w-full group-[.active]:w-full group-[.active]:font-bold duration-300 transition-all ease-in-out absolute bottom-0 left-0 w-0"></div>
            </div>
          </Link>
          <Link href="/new">
            <div
              className={`hover:text-white px-3 h-16 flex items-center relative group gap-1 ${pathname === "/new" ? "active" : ""}`}
            >
              <span className="hidden group-[.active]:block font-bold">/</span>
              Write
              <div className="h-1 bg-[#7833FE] group-hover:w-full group-[.active]:w-full group-[.active]:font-bold duration-300 transition-all ease-in-out absolute bottom-0 left-0 w-0"></div>
            </div>
          </Link>
        </div>
        {/* auth-buttons */}
        <div className="py-4">
          {status === "authenticated" ? (
            <button
              onClick={handleLogout}
              className="ml-auto cursor-pointer px-8 py-2 duration-400 ease-in-out hover:text-white border border-gray-200 hover:-translate-1 hover:bg-[#7833FE] hover:shadow-[3px_3px_0px_rgba(120,51,254,1)] shadow-gray-200"
            >
              👈🏻Logout
            </button>
          ) : (
            <Link href="/login">
              <div className="px-8 py-2 duration-400 ease-in-out hover:text-white border border-gray-200 hover:-translate-1 hover:bg-[#7833FE] hover:shadow-[3px_3px_0px_rgba(120,51,254,1)] shadow-gray-200">
                Sign In
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
