"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Palette, Loader2 } from "lucide-react";

import { API_BASE_URL } from "@repo/common/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LiquidGlassCard } from "@/components/ui/liquid-weather-glass";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/signin`, { email, password });
      const token = res.data.token;
      if (!token) {
        setError("Signin failed: No token received");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", token);

      const roomRes = await axios.post(
        `${API_BASE_URL}/room-id`,
        { name: `My Room ${Date.now().toString().slice(-4)}` },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const roomId = roomRes.data.roomId;
      if (!roomId) {
        setError("Room creation failed");
        setLoading(false);
        return;
      }
      router.push(`/canvas/${roomId}`);
    } catch (err: unknown) {
      const e2 = err as { response?: { data?: { error?: string } } };
      setError(e2.response?.data?.error || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-noise relative flex min-h-screen items-center justify-center px-6 py-12">
      <nav className="absolute left-0 right-0 top-0 z-10 mx-auto flex max-w-6xl items-center justify-between p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04]">
            <Palette className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            DrawBoard
          </span>
        </Link>
      </nav>

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <LiquidGlassCard
          shadowIntensity="md"
          glowIntensity="sm"
          blurIntensity="xl"
          borderRadius="20px"
          className="bg-white/[0.04]"
        >
          <div className="p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.06]">
                <LogIn className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-white/55">
                Sign in to continue drawing
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert
                  variant="destructive"
                  className="animate-slide-up border-red-500/30 bg-red-500/10 text-red-200"
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium text-white/70">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-11 border-white/10 bg-white/[0.04] text-white placeholder:text-white/30 focus-visible:border-white/30 focus-visible:ring-white/15"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-medium text-white/70">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-11 border-white/10 bg-white/[0.04] text-white placeholder:text-white/30 focus-visible:border-white/30 focus-visible:ring-white/15"
                />
              </div>

              <Button
                type="submit"
                className="h-11 w-full bg-white text-black hover:bg-white/90"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-white/55">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-white hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </LiquidGlassCard>
      </div>
    </div>
  );
}
