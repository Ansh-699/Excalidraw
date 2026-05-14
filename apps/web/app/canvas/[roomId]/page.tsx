"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { Users, Share2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LiquidGlassCard } from "@/components/ui/liquid-weather-glass";
import { toast } from "sonner";
import ToolPanel from "./components/ToolPanel";
import type { ShapeType } from "./utils/shapes";
import { DEFAULT_STROKE_COLOR, DEFAULT_STROKE_WIDTH } from "./utils/shapes";

const CanvasBoard = dynamic(() => import("./components/CanvasBoard"), {
  ssr: false,
});

export default function RoomCanvasPage() {
  const params = useParams();
  const roomId = Array.isArray(params?.roomId)
    ? params?.roomId[0]
    : params?.roomId || "";

  const [tool, setTool] = useState<ShapeType>("rectangle");
  const [strokeColor, setStrokeColor] = useState<string>(DEFAULT_STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState<number>(DEFAULT_STROKE_WIDTH);
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
      toast.success("Room ID copied");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    toast.success("Signed out");
    router.push("/");
  };

  if (!roomId) {
    return (
      <div className="bg-noise flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md">
          <LiquidGlassCard
            shadowIntensity="md"
            glowIntensity="sm"
            borderRadius="20px"
            className="bg-white/[0.04]"
          >
            <div className="p-10 text-center">
              <h2 className="text-xl font-semibold text-white">Invalid room</h2>
              <p className="mt-2 text-sm text-white/55">
                The room ID is missing or invalid.
              </p>
              <Button
                onClick={() => router.push("/")}
                className="mt-6 bg-white text-black hover:bg-white/90"
              >
                Go home
              </Button>
            </div>
          </LiquidGlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]">
      {/* Top Bar */}
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        <LiquidGlassCard
          shadowIntensity="xs"
          glowIntensity="none"
          blurIntensity="lg"
          borderRadius="12px"
          className="bg-white/[0.06]"
        >
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-white/85">
            <Users className="h-4 w-4 text-white/60" />
            <span className="font-medium">Room: {roomId.slice(0, 8)}…</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyRoomId}
              className="h-7 w-7 p-0 text-white/70 hover:bg-white/[0.08] hover:text-white"
              title="Copy Room ID"
            >
              <Share2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </LiquidGlassCard>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 border-white/15 bg-white/[0.05] text-white hover:border-white/25 hover:bg-white/[0.08]"
            >
              Join room
            </Button>
          </DialogTrigger>
          <DialogContent className="border-white/10 bg-[#0f0f10] text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Join another room</DialogTitle>
              <DialogDescription className="text-white/55">
                Enter a room ID to collaborate with someone.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roomId" className="text-xs font-medium text-white/70">
                  Room ID
                </Label>
                <Input
                  id="roomId"
                  placeholder="paste a room id"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                  autoFocus
                  className="h-10 border-white/10 bg-white/[0.04] text-white placeholder:text-white/30 focus-visible:border-white/30 focus-visible:ring-white/15"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="border-white/15 bg-white/[0.05] text-white hover:border-white/25 hover:bg-white/[0.08]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-white text-black hover:bg-white/90"
                  disabled={!joinRoomId.trim()}
                >
                  Join
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="h-9 px-3 text-white/70 hover:bg-white/[0.08] hover:text-white"
          title="Sign out"
        >
          <LogOut className="mr-1.5 h-4 w-4" />
          Sign out
        </Button>
      </div>

      <ToolPanel
        currentTool={tool}
        onSelectTool={setTool}
        strokeColor={strokeColor}
        onSelectColor={setStrokeColor}
        strokeWidth={strokeWidth}
        onSelectWidth={setStrokeWidth}
      />

      <CanvasBoard
        roomId={roomId}
        currentTool={tool}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
      />
    </div>
  );
}
