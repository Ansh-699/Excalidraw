"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import ToolPanel from "./components/ToolPanel";

const CanvasBoard = dynamic(() => import("./components/CanvasBoard"), { ssr: false });

export default function RoomCanvasPage() {
  const params = useParams();
  const roomId = Array.isArray(params?.roomId) ? params?.roomId[0] : params?.roomId || "";

  const [tool, setTool] = useState<"rectangle" | "circle" | "triangle" | "pencil" | "eraser">("rectangle");
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

  if (!roomId) return <div>Invalid room</div>;

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

      {/* Tool panel and Canvas */}
      <ToolPanel currentTool={tool} onSelect={setTool} />
      <CanvasBoard roomId={roomId} currentTool={tool} />
    </div>
  );
}
