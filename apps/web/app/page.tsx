"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Users, Download, Palette } from "lucide-react";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6 lg:p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">DrawBoard</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/signin")}
            className="text-primary-600 hover:text-primary-700 font-medium px-4 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="btn-primary"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="animate-fade-in">
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Collaborate visually with{" "}
            <span className="gradient-text">your team</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Create beautiful diagrams, wireframes, and sketches together in
            real-time. Perfect for brainstorming, planning, and visual
            collaboration.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
            <button className="btn-primary text-lg px-8 py-4 animate-bounce-in">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Drawing
            </button>
            <button className="btn-secondary text-lg px-8 py-4 animate-slide-up">
              View Demo
            </button>
          </div>

          {/* Feature Preview */}
          <div className="card-glass p-8 max-w-4xl mx-auto animate-slide-up">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Palette className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-lg font-medium">Canvas Preview</p>
                <p className="text-gray-400 text-sm mt-1">Your creative space awaits</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
            Everything you need to{" "}
            <span className="gradient-text">visualize ideas</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300">
                <Sparkles className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Infinite Canvas
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Draw without limits on an infinite canvas that scales with your
                ideas and creativity.
              </p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300">
                <Users className="w-8 h-8 text-secondary-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Real-time Collaboration
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Work together seamlessly with your team in real-time, no matter where you are.
              </p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-success-100 to-success-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300">
                <Download className="w-8 h-8 text-success-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Export & Share
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Export your drawings in multiple formats and share them easily with anyone.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
