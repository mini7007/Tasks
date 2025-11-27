"use client";
import Box from "@/components/box/box";
import SmartLinkPopup from "@/components/SmartLinkPopup"; // 👈 Add this

const Home = () => {
  return (
    <main className="mb-8">

      {/* 👇 Popup appears when site loads */}
      <SmartLinkPopup />

      <div className="max-w-screen-xl mx-auto py-3">
        <h2 className="text-2xl font-bold tracking-tight">Welcome to iTasks</h2>
        <p className="text-muted-foreground">
          Simplify your task management with ease and efficiency.
        </p>

        <a
          href="https://www.effectivegatecpm.com/kecdvpnbj?key=c5287d7a9600c81a39f67d14509287b5"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
        >
          Boost Your Productivity 🚀
        </a>
      </div>

      <div className="max-w-screen-xl mx-auto">
        <Box />
      </div>
    </main>
  );
};

export default Home;
