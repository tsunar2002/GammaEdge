import React from "react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-[#020420] py-12 border-t border-white/10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-black text-xs font-bold">
            GE
          </div>
          <span className="text-lg font-bold text-white">GammaEdge</span>
        </div>

        <div className="flex gap-8 text-sm text-gray-400">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-white transition-colors">Contact</Link>
        </div>

        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} GammaEdge. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
