"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { Users, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ToolPanel from "./components/ToolPanel";

const CanvasBoard = dynamic(() => import("./components/CanvasBoard"), { ssr: false });

export default function RoomCanvasPage() {
  const params = useParams();
  const roomId = Array.isArray(params?.roomId) ? params?.roomId[0] : params?.roomId || "";

  const [tool, setTool] = useState<"rectangle" | "circle" | "triangle" | "pencil" | "eraser">("rectangle");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
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
      setDialogOpen(false);
      setJoinRoomId("");
    }
  };

  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied to clipboard!");
    }
  };

  if (!roomId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="p-8 text-center backdrop-blur-xl border-white/20 shadow-card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Room</h2>
          <p className="text-gray-600 mb-6">The room ID is missing or invalid.</p>
          <Button onClick={() => router.push("/")} className="bg-gradient-to-r from-primary-600 to-secondary-600">
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-50">
      {/* Top Bar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        {/* Room Info */}
        <Card className="px-4 py-2 flex items-center gap-3 backdrop-blur-xl border-white/20 shadow-md">
          <Users className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Room: {roomId.slice(0, 8)}...</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyRoomId}
            className="h-8 w-8 p-0 hover:bg-gray-100"
            title="Copy Room ID"
          >
            <Share2 className="w-4 h-4 text-gray-600" />
          </Button>
        </Card>

        {/* Join Room Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="border-2 border-primary-200 text-primary-600 hover:bg-primary-50">
              Join Room
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Join Another Room</DialogTitle>
              <DialogDescription>
                Enter the room ID you want to join to collaborate with others.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roomId">Room ID</Label>
                <Input
                  id="roomId"
                  placeholder="Enter room ID to join"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-primary-600 to-secondary-600"
                  disabled={!joinRoomId.trim()}
                >
                  Join Room
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tool Panel */}
      <ToolPanel currentTool={tool} onSelect={setTool} />

      {/* Canvas */}
      <CanvasBoard roomId={roomId} currentTool={tool} />
    </div>
  );
}
