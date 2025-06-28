"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import styles from "./styles.module.css";

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
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.success}>
              🎉 Account created successfully! Redirecting to your canvas...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <Link href="/" className={styles.logoLink}>
          <div className={styles.logoIcon}>
            <div className={styles.logoIconInner} />
          </div>
          <span className={styles.logoText}>DrawBoard</span>
        </Link>
      </nav>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.headerIcon}>
            <UserPlus color="white" size={28} />
          </div>
          <h1 className={styles.cardTitle}>Create Account</h1>
          <p className={styles.cardDescription}>
            Join DrawBoard today and start creating amazing collaborative drawings with friends and colleagues
          </p>
        </div>

        <div className={styles.cardContent}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            
            <div className={styles.inputGroup}>
              <label htmlFor="username" className={styles.label}>
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={styles.input}
                autoComplete="username"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
                autoComplete="email"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.loading}>
                  <span className={styles.spinner}></span>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className={styles.signinLink}>
            <p>
              Already have an account?{" "}
              <Link href="/signin" className={styles.signinLinkText}>
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
