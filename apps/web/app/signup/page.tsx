"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Palette, Loader2, CheckCircle } from "lucide-react";

import { API_BASE_URL } from "@repo/common/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
      // Signup user
      const res = await axios.post(`${API_BASE_URL}/signup`, {
        username,
        email,
        password,
      });

      const token = res.data.token;

      if (!token) {
        setError("Signup failed: No token received");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);

      // Create room
      const roomRes = await axios.post(
        `${API_BASE_URL}/room-id`,
        { name: `My Room ${Date.now().toString().slice(-4)}` },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const roomId = roomRes.data.roomId;
      if (!roomId) {
        setError("Room creation failed");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/canvas/${roomId}`);
      }, 1500);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      const errorMessage = error.response?.data?.error || "Signup failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-success-50 via-primary-50 to-secondary-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full animate-bounce-in backdrop-blur-xl border-white/20 shadow-card">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-full mx-auto flex items-center justify-center shadow-glow">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <Alert variant="default" className="bg-success-50 border-success-200 text-success-700">
              <AlertDescription className="text-center font-semibold">
                🎉 Account created successfully! Redirecting to your canvas...
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-success-50 via-primary-50 to-secondary-50 flex items-center justify-center p-6 relative">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-r from-success-600 to-success-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">DrawBoard</span>
        </Link>
      </nav>

      {/* Main Card */}
      <Card className="w-full max-w-md animate-slide-up backdrop-blur-xl border-white/20 shadow-card">
        <CardHeader className="text-center space-y-6">
          <div className="w-16 h-16 bg-gradient-to-br from-success-600 to-success-700 rounded-full mx-auto flex items-center justify-center shadow-glow animate-bounce-in">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl mb-2">
              <span className="bg-gradient-to-r from-success-600 to-success-700 bg-clip-text text-transparent">
                Create Account
              </span>
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Join DrawBoard today and start creating amazing collaborative drawings with friends and colleagues
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="animate-slide-up">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="h-12"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg bg-gradient-to-r from-success-600 to-success-700 hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Sign in link */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/signin" className="text-success-600 hover:text-success-700 font-semibold transition-colors duration-200">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
