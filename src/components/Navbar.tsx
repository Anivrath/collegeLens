"use client";

import { useSession } from "next-auth/react";
import UserMenu from "@/components/UserMenu";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="border-b bg-black text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="text-xl font-bold hover:text-gray-300">
          CollegeLens
        </a>

        <div className="flex items-center gap-6 text-sm">
          <a href="/" className="hover:text-gray-300">Home</a>
          <a href="/colleges" className="hover:text-gray-300">Colleges</a>
          <a href="/compare" className="hover:text-gray-300">Compare</a>
          <a href="/predictor" className="hover:text-gray-300">Predictor</a>
          <a href="/qa" className="hover:text-gray-300">Q&A</a>

          {user ? (
            <>
              <a href="/saved" className="hover:text-gray-300">Saved</a>
              <UserMenu user={{ name: user.name || "", email: user.email || "" }} />
            </>
          ) : (
            <>
              <a href="/login" className="hover:text-gray-300">Login</a>
              <a href="/signup" className="rounded-lg bg-white px-4 py-2 text-black hover:bg-gray-200">
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}