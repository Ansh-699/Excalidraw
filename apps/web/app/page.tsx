"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Users,
  Undo2,
  Palette,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiquidGlassCard } from "@/components/ui/liquid-weather-glass";

const HomePage = () => {
  const router = useRouter();

  const handleStartDrawing = () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (token) {
      const roomId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `room-${Date.now()}`;
      router.push(`/canvas/${roomId}`);
    } else {
      router.push("/signup");
    }
  };

  return (
    <div className="bg-noise relative min-h-screen overflow-hidden">
      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:py-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04]">
            <Palette className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            DrawBoard
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => router.push("/signin")}
            className="text-white/80 hover:bg-white/[0.06] hover:text-white"
          >
            Sign in
          </Button>
          <Button
            onClick={() => router.push("/signup")}
            className="bg-white text-black hover:bg-white/90"
          >
            Sign up
          </Button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-12 pb-24 text-center lg:pt-20">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs text-white/70 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5" />
          Real-time collaborative canvas
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl animate-slide-up">
          Sketch together.
          <br />
          <span className="gradient-text">Synced in real time.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-white/60 lg:text-lg animate-slide-up">
          Rectangles, circles, triangles, freehand pencil and an eraser — every
          stroke streamed over WebSockets, persisted to Postgres.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row animate-slide-up">
          <Button
            size="lg"
            onClick={handleStartDrawing}
            className="h-11 bg-white px-6 text-base text-black hover:bg-white/90"
          >
            Start drawing
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/signin")}
            className="h-11 border-white/15 bg-white/[0.04] px-6 text-base text-white hover:border-white/25 hover:bg-white/[0.08]"
          >
            Sign in
          </Button>
        </div>

        {/* Hero glass preview */}
        <div className="mt-16 w-full max-w-3xl animate-slide-up">
          <LiquidGlassCard
            shadowIntensity="md"
            glowIntensity="sm"
            blurIntensity="xl"
            borderRadius="20px"
            className="bg-white/[0.04] p-1"
          >
            <div className="rounded-[16px] border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-10">
              <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-white/15">
                <div className="text-center">
                  <Palette className="mx-auto mb-3 h-10 w-10 text-white/40" />
                  <p className="text-sm font-medium text-white/70">
                    Canvas preview
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    Sign up to draw and share rooms
                  </p>
                </div>
              </div>
            </div>
          </LiquidGlassCard>
        </div>
      </main>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-5 md:grid-cols-3">
          <LiquidGlassCard
            shadowIntensity="sm"
            glowIntensity="xs"
            borderRadius="16px"
            className="bg-white/[0.04]"
          >
            <div className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/[0.05]">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Multi-tool canvas
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Rectangles, circles, triangles, freehand pencil, an eraser, six
                colors, three stroke widths.
              </p>
            </div>
          </LiquidGlassCard>

          <LiquidGlassCard
            shadowIntensity="sm"
            glowIntensity="xs"
            borderRadius="16px"
            className="bg-white/[0.04]"
          >
            <div className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/[0.05]">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Real-time rooms
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Share a room link and draw together over WebSockets — strokes
                persist in Postgres, no refresh required.
              </p>
            </div>
          </LiquidGlassCard>

          <LiquidGlassCard
            shadowIntensity="sm"
            glowIntensity="xs"
            borderRadius="16px"
            className="bg-white/[0.04]"
          >
            <div className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/[0.05]">
                <Undo2 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Undo / redo
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-xs">
                  Ctrl
                </kbd>{" "}
                +{" "}
                <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-xs">
                  Z
                </kbd>{" "}
                to undo, broadcast across the room.
              </p>
            </div>
          </LiquidGlassCard>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
