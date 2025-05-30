"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import ToolPanel from "./components/ToolPanel";

const CanvasBoard = dynamic(() => import("./components/CanvasBoard"), { ssr: false });

export default function RoomCanvasPage({ params }: { params: { roomId: string } }) {
  const [tool, setTool] = useState<"rectangle" | "circle" | "triangle" | "pencil">("rectangle");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
    }
  }, [router]);

  return (
    <div>
      <ToolPanel currentTool={tool} onSelect={setTool} />
      <CanvasBoard roomId={params.roomId} currentTool={tool} />
    </div>
  );
}
