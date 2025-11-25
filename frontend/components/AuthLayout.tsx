import React from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Column - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-50">
        {/* Background Image */}
        <div className="absolute inset-0">
            <Image
                src="/option-greeks-visual.png"
                alt="Option Greeks Background"
                fill
                className="object-cover object-center"
                priority
            />
            {/* Overlay Gradient for text readability */}
            <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 w-full p-12 flex flex-col justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold shadow-lg">
                GE
            </div>
            <span className="text-xl font-bold text-white drop-shadow-sm">GammaEdge</span>
          </div>

          {/* Hero Text */}
          <div className="max-w-lg mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight drop-shadow-sm">
              Practice options trading risk-free with historical data.
            </h1>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="w-full max-w-sm">
            {children}
        </div>
        
        <div className="mt-16 flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-gray-600">Home</a>
            <a href="#" className="hover:text-gray-600">Privacy</a>
            <a href="#" className="hover:text-gray-600">Terms</a>
        </div>
      </div>
    </div>
  );
}
