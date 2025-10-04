"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { Users, Share2 } from "lucide-react";
import ToolPanel from "./components/ToolPanel";

const CanvasBoard = dynamic(() => import("./components/CanvasBoard"), { ssr: false });

export default function RoomCanvasPage() {
  const params = useParams();
  const roomId = Array.isArray(params?.roomId) ? params?.roomId[0] : params?.roomId || "";

  const [tool, setTool] = useState<"rectangle" | "circle" | "triangle" | "pencil" | "eraser">("rectangle");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [showJoinForm, setShowJoinForm] = useState(false);
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

  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      // You could add a toast notification here
    }
  };

  if (!roomId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="card-glass p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Room</h2>
          <p className="text-gray-600 mb-6">The room ID is missing or invalid.</p>
          <button
            onClick={() => router.push("/")}
            className="btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-50">
      {/* Top Bar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        {/* Room Info */}
        <div className="card-glass px-4 py-2 flex items-center gap-3">
          <Users className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Room: {roomId.slice(0, 8)}...</span>
          <button
            onClick={copyRoomId}
            className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
            title="Copy Room ID"
          >
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Join Room Button */}
        <button
          onClick={() => setShowJoinForm(!showJoinForm)}
          className="btn-secondary px-4 py-2 text-sm"
        >
          Join Room
        </button>
      </div>

      {/* Join Room Form */}
      {showJoinForm && (
        <div className="absolute top-16 right-4 z-20 card-glass p-4 w-80 animate-slide-up">
          <form onSubmit={handleJoinRoom} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room ID
              </label>
              <input
                type="text"
                placeholder="Enter room ID to join"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                className="input-field text-sm"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1 py-2 text-sm">
                Join Room
              </button>
              <button
                type="button"
                onClick={() => setShowJoinForm(false)}
                className="btn-secondary py-2 px-4 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tool Panel */}
      <ToolPanel currentTool={tool} onSelect={setTool} />
      
      {/* Canvas */}
      <CanvasBoard roomId={roomId} currentTool={tool} />
    </div>
  );
}
