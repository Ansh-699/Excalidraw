// app/canvas/[roomId]/page.tsx
"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import ToolPanel from "./components/ToolPanel";

const CanvasBoard = dynamic(() => import("./components/CanvasBoard"), { ssr: false });

export default function RoomCanvasPage({ params }: { params: { roomId: string } }) {
  const [tool, setTool] = useState<"rectangle"|"circle"|"triangle"|"pencil">("rectangle");

  return (
    <div>
      <ToolPanel currentTool={tool} onSelect={setTool} />
      <CanvasBoard roomId={params.roomId} currentTool={tool} />
    </div>
  );
}
