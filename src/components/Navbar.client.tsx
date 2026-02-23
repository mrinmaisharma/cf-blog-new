"use client";

import dynamic from "next/dynamic";

const NavbarNoSSR = dynamic(() => import("@/components/Navbar"), {
  ssr: false,
});

export default function NavbarClient() {
  return <NavbarNoSSR />;
}
