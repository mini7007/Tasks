"use client";

import { useEffect, useState } from "react";

export default function SmartLinkPopup() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("popup_shown")) {
      setOpen(false);
    }
  }, []);

  const closePopup = () => {
    sessionStorage.setItem("popup_shown", "1");
    setOpen(false);
  };

  if (!open) {
    return null; // MUST be before JSX
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-neutral-900 text-white p-6 rounded-xl max-w-md text-center border border-neutral-700 shadow-xl">
        <h2 className="text-xl font-bold mb-2">Welcome to iTasks 👋</h2>
        <p className="text-sm mb-4 opacity-80">
          Organize tasks effortlessly, set challenges, and export your progress — all without sign-ups.
        </p>

        {/* 🚀 SmartLink Button */}
        <a
          href="https://www.effectivegatecpm.com/kecdvpnbj?key=c5287d7a9600c81a39f67d14509287b5"
          target="_blank"
          rel="noopener noreferrer"
          onClick={closePopup}
          className="inline-block w-full mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition"
        >
          Boost Your Productivity 🚀
        </a>

        <button
          onClick={closePopup}
          className="mt-4 text-xs text-gray-400 hover:text-gray-200 transition"
        >
          Continue to iTasks →
        </button>
      </div>
    </div>
  );
}
