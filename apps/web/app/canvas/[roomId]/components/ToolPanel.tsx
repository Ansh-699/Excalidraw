// components/ToolPanel.tsx
import React from "react";
import { Square, Circle, Triangle, Pencil, Eraser } from "lucide-react";
import { ShapeType } from "../utils/shapes";

interface ToolPanelProps {
    currentTool: ShapeType;
    onSelect: (tool: ShapeType) => void;
}

const toolIcons = {
    rectangle: Square,
    circle: Circle,
    triangle: Triangle,
    pencil: Pencil,
    eraser: Eraser,
};

export default function ToolPanel({ currentTool, onSelect }: ToolPanelProps) {
    const tools: ShapeType[] = ["rectangle", "circle", "triangle", "pencil", "eraser"];
    
    return (
        <nav style={{
            position: "fixed", 
            top: "20px", 
            left: "50%", 
            transform: "translateX(-50%)",
            display: "flex", 
            gap: "0.5rem", 
            padding: "0.75rem 1rem",
            background: "rgba(255, 255, 255, 0.95)", 
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(10px)",
            zIndex: 10
        }}>
            {tools.map((tool) => {
                const IconComponent = toolIcons[tool];
                return (
                    <button
                        key={tool}
                        onClick={() => onSelect(tool)}
                        style={{
                            padding: "0.5rem",
                            background: currentTool === tool ? "#007acc" : "transparent",
                            color: currentTool === tool ? "#fff" : "#333",
                            border: "1px solid transparent",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <IconComponent size={18} />
                    </button>
                );
            })}
        </nav>
    );
}
