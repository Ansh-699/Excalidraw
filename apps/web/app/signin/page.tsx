// app/signin/page.tsx
"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SigninPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    
   const BACKEND_URL =  "http://142.93.223.72:3001";




    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Step 1: Sign in
            const res = await axios.post(`${BACKEND_URL}/signup`, {
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

            // Step 2: Request room ID
            const roomRes = await axios.post(
                "http://142.93.223.72:3001/room-id",
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

            // Step 3: Redirect to canvas
            router.push(`/canvas/${roomId}`);
        } catch (err: any) {
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Sign In</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
            </button>
        </form>
    );
}
