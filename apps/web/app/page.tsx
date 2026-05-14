"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Users,
  Undo2,
  Palette,
  ArrowRight,
  Square,
  Circle as CircleIcon,
  Triangle as TriangleIcon,
  Pencil,
  Eraser,
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
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
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
      <main className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-10 pb-16 text-center lg:pt-14">
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

        <div className="mt-8 animate-slide-up">
          <Button
            size="lg"
            onClick={handleStartDrawing}
            className="h-11 bg-white px-6 text-base text-black hover:bg-white/90"
          >
            Start drawing
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        {/* Mock canvas preview */}
        <div className="mt-14 w-full max-w-4xl animate-slide-up">
          <LiquidGlassCard
            shadowIntensity="md"
            glowIntensity="sm"
            blurIntensity="xl"
            borderRadius="20px"
            className="bg-white/[0.04] p-1.5"
          >
            <div className="relative overflow-hidden rounded-[14px] border border-white/10 bg-[#0c0c0d]">
              {/* faux window dots */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                </div>
                <span className="font-mono text-[10px] tracking-wide text-white/30">
                  drawboard.app/canvas/4f3a…
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-white/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  3 online
                </span>
              </div>

              {/* canvas area */}
              <div className="relative h-72 sm:h-80">
                {/* subtle grid */}
                <div
                  className="absolute inset-0 opacity-[0.18]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />

                {/* mini tool panel */}
                <div className="absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-lg border border-white/10 bg-white/[0.06] backdrop-blur-md">
                  <div className="flex items-center gap-1 px-2 py-1.5">
                    {[
                      { Icon: Square, active: true },
                      { Icon: CircleIcon, active: false },
                      { Icon: TriangleIcon, active: false },
                      { Icon: Pencil, active: false },
                      { Icon: Eraser, active: false },
                    ].map(({ Icon, active }, i) => (
                      <span
                        key={i}
                        className={
                          "flex h-6 w-6 items-center justify-center rounded " +
                          (active ? "bg-white text-black" : "text-white/55")
                        }
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    ))}
                    <span className="mx-1 h-4 w-px bg-white/15" />
                    {["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"].map(
                      (c) => (
                        <span
                          key={c}
                          className="h-3.5 w-3.5 rounded-full border border-white/20"
                          style={{ background: c }}
                        />
                      ),
                    )}
                  </div>
                </div>

                {/* sketched shapes */}
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 800 320"
                  preserveAspectRatio="xMidYMid meet"
                  fill="none"
                >
                  {/* freehand stroke */}
                  <path
                    d="M 90 220 C 130 180, 160 240, 200 200 S 270 160, 320 220 T 420 200"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* rectangle */}
                  <rect
                    x="100"
                    y="80"
                    width="170"
                    height="90"
                    rx="4"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                  />
                  {/* circle */}
                  <circle
                    cx="430"
                    cy="125"
                    r="46"
                    stroke="#10b981"
                    strokeWidth="2.5"
                  />
                  {/* triangle */}
                  <polygon
                    points="540,170 600,80 660,170"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                  />
                  {/* connector */}
                  <path
                    d="M 270 125 L 384 125"
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M 476 125 L 540 130"
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  {/* small label */}
                  <text
                    x="120"
                    y="105"
                    fill="rgba(255,255,255,0.7)"
                    fontFamily="ui-sans-serif, system-ui"
                    fontSize="13"
                  >
                    auth
                  </text>
                  <text
                    x="408"
                    y="130"
                    fill="rgba(255,255,255,0.7)"
                    fontFamily="ui-sans-serif, system-ui"
                    fontSize="13"
                  >
                    api
                  </text>
                  <text
                    x="572"
                    y="150"
                    fill="rgba(255,255,255,0.7)"
                    fontFamily="ui-sans-serif, system-ui"
                    fontSize="13"
                  >
                    ws
                  </text>
                </svg>

                {/* presence cursors */}
                <Cursor color="#a855f7" name="ada" x="22%" y="58%" />
                <Cursor color="#22c55e" name="leo" x="68%" y="32%" />
              </div>
            </div>
          </LiquidGlassCard>
        </div>
      </main>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-5 md:grid-cols-3">
          <Feature
            Icon={Sparkles}
            title="Multi-tool canvas"
            body="Rectangles, circles, triangles, freehand pencil, an eraser, six colors, three stroke widths."
          />
          <Feature
            Icon={Users}
            title="Real-time rooms"
            body="Share a room link and draw together over WebSockets — strokes persist in Postgres, no refresh required."
          />
          <Feature
            Icon={Undo2}
            title="Undo / redo"
            body={
              <>
                <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-xs">
                  Ctrl
                </kbd>{" "}
                +{" "}
                <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-xs">
                  Z
                </kbd>{" "}
                to undo, broadcast across the room.
              </>
            }
          />
        </div>
      </section>
    </div>
  );
};

function Feature({
  Icon,
  title,
  body,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <LiquidGlassCard
      shadowIntensity="sm"
      glowIntensity="xs"
      borderRadius="16px"
      className="bg-white/[0.04]"
    >
      <div className="p-6">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/[0.05]">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/60">{body}</p>
      </div>
    </LiquidGlassCard>
  );
}

function Cursor({
  color,
  name,
  x,
  y,
}: {
  color: string;
  name: string;
  x: string;
  y: string;
}) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{ left: x, top: y, transform: "translate(-2px, -2px)" }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M2 2 L2 14 L6 11 L9 16 L11 15 L8 10 L13 10 Z"
          fill={color}
          stroke="white"
          strokeWidth="0.8"
        />
      </svg>
      <span
        className="ml-3 inline-block translate-y-[-4px] rounded px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm"
        style={{ background: color }}
      >
        {name}
      </span>
    </div>
  );
}

export default HomePage;
