"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";
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
    } catch (err: any) {
      setError(err.response?.data?.error || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .container {
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            #faf5ff 0%,
            #eff6ff 50%,
            #e0e7ff 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
        }

        .navbar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          max-width: 1280px;
          margin: 0 auto;
        }

        .logo-link {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(to right, #9333ea, #2563eb);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-icon-inner {
          width: 16px;
          height: 16px;
          background-color: white;
          border-radius: 2px;
        }

        .logo-text {
          font-size: 20px;
          font-weight: bold;
          color: #111827;
        }

        .card {
          width: 100%;
          max-width: 448px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: none;
          border-radius: 8px;
          background-color: white;
        }

        .card-header {
          text-align: center;
          padding: 24px 24px 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(to right, #9333ea, #2563eb);
          border-radius: 50%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-title {
          font-size: 24px;
          font-weight: bold;
          color: #111827;
          margin: 0;
        }

        .card-description {
          color: #4b5563;
          margin: 0;
        }

        .card-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .error {
          color: #ef4444;
          text-align: center;
          font-size: 14px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .input {
          height: 48px;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
        }

        .submit-button {
          width: 100%;
          height: 48px;
          background: linear-gradient(to right, #9333ea, #2563eb);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 18px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .submit-button:hover {
          background: linear-gradient(to right, #7c2d12, #1d4ed8);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .divider {
          position: relative;
        }

        .divider-line {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background-color: #d1d5db;
        }

        .divider-text {
          position: relative;
          display: flex;
          justify-content: center;
          font-size: 12px;
          text-transform: uppercase;
          color: #6b7280;
          background-color: white;
          padding: 0 8px;
        }

        .social-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .social-button {
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background-color: white;
          cursor: pointer;
          text-decoration: none;
          color: #374151;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .signup-link {
          text-align: center;
          color: #4b5563;
        }

        .signup-link-text {
          color: #9333ea;
          text-decoration: none;
          font-weight: 600;
        }

        .icon {
          width: 20px;
          height: 20px;
        }
      `}</style>

      <div className="container">
        <nav className="navbar">
          <Link href="/" className="logo-link">
            <div className="logo-icon">
              <div className="logo-icon-inner" />
            </div>
            <span className="logo-text">DrawBoard</span>
          </Link>
        </nav>

        <div className="card">
          <div className="card-header">
            <div className="header-icon">
              <LogIn color="white" size={24} />
            </div>
            <h1 className="card-title">Welcome back</h1>
            <p className="card-description">
              Sign in to your DrawBoard account to continue creating
            </p>
          </div>

          <div className="card-content">
            <form onSubmit={handleSubmit} className="form">
              {error && <div className="error">{error}</div>}
              <div className="input-group">
                <label htmlFor="email" className="label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input"
                />
              </div>
              <div className="input-group">
                <label htmlFor="password" className="label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input"
                />
              </div>
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="divider">
              <div className="divider-line" />
              <div className="divider-text">
                <span>Or continue with</span>
              </div>
            </div>

            <div className="social-buttons">
              <button className="social-button">
                <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button className="social-button">
                <svg className="icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            <div className="signup-link">
              <p>
                Don't have an account?{" "}
                <Link href="/signup" className="signup-link-text">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
