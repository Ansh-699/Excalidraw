"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Users, Download, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => { }, []);

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
          <Button
            variant="ghost"
            onClick={() => router.push("/signin")}
            className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
          >
            Sign In
          </Button>
          <Button
            onClick={() => router.push("/signup")}
            className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
          >
            Sign Up
          </Button>
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
            <Button
              size="lg"
              className="text-lg px-8 bg-gradient-to-r from-primary-600 to-secondary-600 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 animate-bounce-in"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Drawing
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 border-2 border-primary-200 text-primary-600 hover:bg-primary-50 hover:border-primary-300 transition-all duration-300 hover:-translate-y-1 animate-slide-up"
            >
              View Demo
            </Button>
          </div>

          {/* Feature Preview */}
          <Card className="p-8 max-w-4xl mx-auto animate-slide-up backdrop-blur-xl border-white/20 shadow-card">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Palette className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-lg font-medium">Canvas Preview</p>
                <p className="text-gray-400 text-sm mt-1">Your creative space awaits</p>
              </div>
            </div>
          </Card>
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
            <Card className="text-center group hover:scale-105 transition-transform duration-300 border-white/20 backdrop-blur-xl shadow-card hover:shadow-card-hover">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-all duration-300">
                  <Sparkles className="w-8 h-8 text-primary-600" />
                </div>
                <CardTitle className="text-xl">Infinite Canvas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">
                  Draw without limits on an infinite canvas that scales with your ideas and creativity.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center group hover:scale-105 transition-transform duration-300 border-white/20 backdrop-blur-xl shadow-card hover:shadow-card-hover">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-all duration-300">
                  <Users className="w-8 h-8 text-secondary-600" />
                </div>
                <CardTitle className="text-xl">Real-time Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">
                  Work together seamlessly with your team in real-time, no matter where you are.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center group hover:scale-105 transition-transform duration-300 border-white/20 backdrop-blur-xl shadow-card hover:shadow-card-hover">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-success-100 to-success-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-all duration-300">
                  <Download className="w-8 h-8 text-success-600" />
                </div>
                <CardTitle className="text-xl">Export & Share</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">
                  Export your drawings in multiple formats and share them easily with anyone.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
