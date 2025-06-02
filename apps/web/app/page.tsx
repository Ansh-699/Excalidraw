"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  // Temporarily remove prefetch
  useEffect(() => {}, []);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>
            <svg style={styles.logoSvg} fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </div>
          <h1 style={styles.logoText}>DrawBoard</h1>
        </div>
        <div style={styles.headerButtons}>
          <button
            onClick={() => {
              console.log("Navigating to /signin");
              router.push("/signin");
            }}
            style={styles.signInButton}
          >
            Sign In
          </button>

          <button
            onClick={() => router.push("/signup")}
            style={styles.signUpButton}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <h2 style={styles.mainTitle}>Collaborate visually with your team</h2>
        <p style={styles.mainDescription}>
          Create beautiful diagrams, wireframes, and sketches together in
          real-time. Perfect for brainstorming, planning, and visual
          collaboration.
        </p>

        <div style={styles.ctaButtons}>
          <button style={styles.startButton}>Start Drawing</button>
          <button style={styles.demoButton}>View Demo</button>
        </div>

        {/* Feature Preview */}
        <div style={styles.previewContainer}>
          <div style={styles.canvasPreview}>
            <div style={styles.canvasPlaceholder}>Canvas Preview</div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <div style={styles.featuresContainer}>
          <h3 style={styles.featuresTitle}>
            Everything you need to visualize ideas
          </h3>
          <div style={styles.featuresGrid}>
            <div style={styles.featureItem}>
              <div style={styles.featureIconPurple}>
                <svg
                  style={styles.featureIcon}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h4 style={styles.featureTitle}>Infinite Canvas</h4>
              <p style={styles.featureDescription}>
                Draw without limits on an infinite canvas that scales with your
                ideas
              </p>
            </div>
            <div style={styles.featureItem}>
              <div style={styles.featureIconBlue}>
                <svg
                  style={styles.featureIcon}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 style={styles.featureTitle}>Real-time Collaboration</h4>
              <p style={styles.featureDescription}>
                Work together seamlessly with your team in real-time
              </p>
            </div>
            <div style={styles.featureItem}>
              <div style={styles.featureIconGreen}>
                <svg
                  style={styles.featureIcon}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h4 style={styles.featureTitle}>Export & Share</h4>
              <p style={styles.featureDescription}>
                Export your drawings in multiple formats and share easily
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #faf5ff, #eff6ff)",
    display: "flex",
    flexDirection: "column" as const,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  logoIcon: {
    width: "2rem",
    height: "2rem",
    backgroundColor: "#9333ea",
    borderRadius: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoSvg: {
    width: "1.25rem",
    height: "1.25rem",
    color: "white",
  },
  logoText: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#1f2937",
    margin: 0,
  },
  headerButtons: {
    display: "flex",
    gap: "1rem",
  },
  signInButton: {
    padding: "0.5rem 1rem",
    color: "#9333ea",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    transition: "color 0.2s",
  },
  signUpButton: {
    padding: "0.5rem 1.5rem",
    backgroundColor: "#9333ea",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "0 1.5rem",
    textAlign: "center" as const,
  },
  mainTitle: {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "1.5rem",
    margin: "0 0 1.5rem 0",
  },
  mainDescription: {
    fontSize: "1.25rem",
    color: "#4b5563",
    marginBottom: "2rem",
    maxWidth: "32rem",
    lineHeight: 1.6,
    margin: "0 0 2rem 0",
  },
  ctaButtons: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
    marginBottom: "3rem",
  },
  startButton: {
    padding: "1rem 2rem",
    backgroundColor: "#9333ea",
    color: "white",
    fontSize: "1.125rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  demoButton: {
    padding: "1rem 2rem",
    border: "2px solid #9333ea",
    color: "#9333ea",
    backgroundColor: "transparent",
    fontSize: "1.125rem",
    fontWeight: "600",
    borderRadius: "0.5rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  previewContainer: {
    backgroundColor: "white",
    borderRadius: "0.75rem",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    padding: "2rem",
    maxWidth: "56rem",
    width: "100%",
  },
  canvasPreview: {
    backgroundColor: "#f3f4f6",
    borderRadius: "0.5rem",
    height: "16rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  canvasPlaceholder: {
    color: "#6b7280",
    fontSize: "1.125rem",
  },
  featuresSection: {
    padding: "4rem 1.5rem",
  },
  featuresContainer: {
    maxWidth: "72rem",
    margin: "0 auto",
  },
  featuresTitle: {
    fontSize: "1.875rem",
    fontWeight: "bold",
    textAlign: "center" as const,
    color: "#111827",
    marginBottom: "3rem",
    margin: "0 0 3rem 0",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
  },
  featureItem: {
    textAlign: "center" as const,
  },
  featureIconPurple: {
    width: "3rem",
    height: "3rem",
    backgroundColor: "#f3e8ff",
    borderRadius: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem auto",
  },
  featureIconBlue: {
    width: "3rem",
    height: "3rem",
    backgroundColor: "#dbeafe",
    borderRadius: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem auto",
  },
  featureIconGreen: {
    width: "3rem",
    height: "3rem",
    backgroundColor: "#dcfce7",
    borderRadius: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem auto",
  },
  featureIcon: {
    width: "1.5rem",
    height: "1.5rem",
    color: "#9333ea",
  },
  featureTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "0.5rem",
    margin: "0 0 0.5rem 0",
  },
  featureDescription: {
    color: "#4b5563",
    lineHeight: 1.6,
    margin: 0,
  },
};

export default page;
