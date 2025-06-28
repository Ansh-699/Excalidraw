"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";
import styles from "./styles.module.css";

import { API_BASE_URL } from "@repo/common/config";

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
      const res = await axios.post(`${API_BASE_URL}/signin`, {
        email,
        password,
      });
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
        }
      );

      const roomId = roomRes.data.roomId;
      if (!roomId) {
        setError("Room creation failed");
        setLoading(false);
        return;
      }

      router.push(`/canvas/${roomId}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

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
            <LogIn color="white" size={28} />
          </div>
          <h1 className={styles.cardTitle}>Welcome back</h1>
          <p className={styles.cardDescription}>
            Sign in to your DrawBoard account to continue creating amazing collaborative drawings
          </p>
        </div>

        <div className={styles.cardContent}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
                autoComplete="current-password"
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
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <div className={styles.dividerText}>
              <span>Or continue with</span>
            </div>
          </div>

          <div className={styles.socialButtons}>
            <button className={styles.socialButton}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button className={styles.socialButton}>
              <svg className={styles.icon} fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          <div className={styles.signupLink}>
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className={styles.signupLinkText}>
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
