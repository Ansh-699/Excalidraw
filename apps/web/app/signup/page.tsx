"use client";
import React, { useState } from "react";
import axios from "axios";

export default function SignupPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);


const BACKEND_URL =  "http://localhost:3001";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await axios.post(`${BACKEND_URL}/signup`, {
                username,
                email,
                password,
            });

            setSuccess(true);
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError("Signup failed");
            }
        }
    };

    if (success) {
        return <p>Signup successful! You can now sign in.</p>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Sign Up</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />

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

            <button type="submit">Sign Up</button>
        </form>
    );
}
