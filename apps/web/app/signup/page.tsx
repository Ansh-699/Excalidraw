"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Palette, Loader2, CheckCircle2 } from "lucide-react";

import { API_BASE_URL } from "@repo/common/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LiquidGlassCard } from "@/components/ui/liquid-weather-glass";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/signup`, { username, email, password });
      setSuccess(true);
      setTimeout(() => router.push("/signin"), 1500);
    } catch (err: unknown) {
      const e2 = err as { response?: { data?: { error?: string } } };
      setError(e2.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-noise relative flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md animate-slide-up">
          <LiquidGlassCard
            shadowIntensity="md"
            glowIntensity="sm"
            borderRadius="20px"
            className="bg-white/[0.04]"
          >
            <div className="p-10 text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.06]">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-white">
                Account created
              </h2>
              <p className="mt-2 text-sm text-white/55">
                Redirecting to sign in...
              </p>
            </div>
          </LiquidGlassCard>
        </div>
      </div>
    );
  }

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
                <UserPlus className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-white/55">
                Start drawing in seconds
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
                <Label htmlFor="username" className="text-xs font-medium text-white/70">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="ada"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="h-11 border-white/10 bg-white/[0.04] text-white placeholder:text-white/30 focus-visible:border-white/30 focus-visible:ring-white/15"
                />
              </div>

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
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
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
                    Creating account...
                  </span>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-white/55">
              Already have an account?{" "}
              <Link href="/signin" className="font-medium text-white hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </LiquidGlassCard>
      </div>
    </div>
  );
}
