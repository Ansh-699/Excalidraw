"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
        return;
      }

      setSuccess(true);
      router.push(`/canvas/${roomId}`);
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f0f0f0",
        }}
      >
        <p style={{ color: "green", fontSize: "1.5em" }}>
          Signup successful! Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "300px",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#333" }}>Sign Up</h1>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: loading ? "#999" : "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p style={{ textAlign: "center" }}>
          Already have an account?{" "}
          <Link href="/signin" style={{ color: "#0070f3" }}>
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
