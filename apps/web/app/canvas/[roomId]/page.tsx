"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import ToolPanel from "./components/ToolPanel";

const CanvasBoard = dynamic(() => import("./components/CanvasBoard"), { ssr: false });

export default function RoomCanvasPage({ params }: { params: { roomId: string } }) {
  const [tool, setTool] = useState<"rectangle" | "circle" | "triangle" | "pencil">("rectangle");
  const [joinRoomId, setJoinRoomId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
    }
  }, [router]);

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinRoomId.trim()) {
      router.push(`/canvas/${joinRoomId.trim()}`);
    }
  };

  return (
    <div>
      {/* Room Join Form */}
      <form onSubmit={handleJoinRoom} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter room ID to join"
          value={joinRoomId}
          onChange={(e) => setJoinRoomId(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <button type="submit">Join Room</button>
      </form>

      {/* Your existing canvas and tools */}
      <ToolPanel currentTool={tool} onSelect={setTool} />
      <CanvasBoard roomId={params.roomId} currentTool={tool} />
    </div>
  );
}
