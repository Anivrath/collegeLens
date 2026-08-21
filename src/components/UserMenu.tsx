"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";

type UserMenuProps = {
  user: {
    name: string;
    email: string;
  };
};

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-white px-4 py-2 text-sm hover:bg-gray-800"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-semibold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden md:inline">{user.name}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg border bg-white shadow-lg">
          <div className="border-b p-4">
            <p className="font-semibold text-black">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>

          <div className="py-2">
            <a
              href="/profile"
              className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
            >
              Profile
            </a>
            <a
              href="/saved"
              className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
            >
              Saved Colleges
            </a>
            <a
              href="/qa/my-questions"
              className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
            >
              My Questions
            </a>
            <a
              href="/qa/my-answers"
              className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
            >
              My Answers
            </a>
          </div>

          <div className="border-t py-2">
            <button
              onClick={handleSignOut}
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
