"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Palette, Loader2, CheckCircle } from "lucide-react";

import { API_BASE_URL } from "@repo/common/config";

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
        <div className="card-glass max-w-md w-full animate-bounce-in">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-glow">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div className="bg-success-50 border border-success-200 text-success-700 px-6 py-4 rounded-xl font-semibold">
              🎉 Account created successfully! Redirecting to your canvas...
            </div>
          </div>
        </div>
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
      <div className="card-glass w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center p-8 pb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-success-600 to-success-700 rounded-full mx-auto mb-6 flex items-center justify-center shadow-glow animate-bounce-in">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-success-600 to-success-700 bg-clip-text text-transparent">
              Create Account
            </span>
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Join DrawBoard today and start creating amazing collaborative drawings with friends and colleagues
          </p>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-slide-up">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="input-field"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-success-600 to-success-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-glow transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
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
            </button>
          </form>

          {/* Sign in link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/signin" className="text-success-600 hover:text-success-700 font-semibold transition-colors duration-200">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
