"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j?.error ?? "Signup failed");
      return;
    }

    // auto-login after signup
    const login = await signIn("credentials", { email, password, redirect: false });
    if (login?.error) router.push("/login");
    else router.push("/");
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Signup</h1>
      {err && <p className="text-red-600">{err}</p>}

      <form onSubmit={onSubmit} className="space-y-3">
        <input className="border p-2 w-full" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Password (min 8)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="border px-4 py-2 rounded w-full" type="submit">Create account</button>
      </form>
    </main>
  );
}
